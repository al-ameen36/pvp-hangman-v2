import {
  StateSetter,
  useWebView,
  Devvit,
  UseChannelResult,
} from "@devvit/public-api";
import { DevvitMessage, WebViewMessage } from "./message.js";
import { createGame, joinGame } from "./utils.js";
import { Game } from "./types.js";

type Props = {
  get: () => Game;
  set: StateSetter<Game | null>;
};

export const setupWebview = (
  context: Devvit.Context,
  gameChannel: UseChannelResult<any>,
  game: Props
) => {
  const webView = useWebView<WebViewMessage, DevvitMessage>({
    url: "index.html",

    // Handle messages sent from the web view
    async onMessage(message, webView) {
      switch (message.type) {
        case "webViewReady":
          console.log("Game Ready");
          break;

        case "create_game":
          const createdGame = await createGame(context);
          game.set(createdGame);
          webView.postMessage({
            type: "game_created",
            data: { game: createdGame },
          });
          break;

        case "join_game":
          const joinedGame = await joinGame(context, message.data.gameId);
          game.set(joinedGame);
          webView.postMessage({
            type: "game_joined",
            data: { game: joinedGame },
          });
          const newGame: { game: Game | null } = {
            game: joinedGame,
          };

          if (gameChannel) await gameChannel.send(newGame);
          break;

        default:
          console.error(`Unknown message type: ${message.type}`);
      }
    },
    onUnmount() {
      context.ui.showToast("Web view closed!");
      webView = null;
    },
  });

  return webView;
};
