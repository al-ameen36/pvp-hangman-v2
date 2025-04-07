import "./createPost.js";
import { Devvit, useChannel, useState, useWebView } from "@devvit/public-api";
import type { DevvitMessage, WebViewMessage } from "./message.js";
import { createGame, getRedisGame, joinGame, setRedisGame } from "./utils.js";
import { Game } from "./types.js";

Devvit.configure({
  redditAPI: true,
  redis: true,
  realtime: true,
});

function generateGameId(): string {
  return (
    Math.random().toString(36).substring(2, 6) +
    "-" +
    Date.now().toString(36).slice(-4)
  );
}

// Add a custom post type to Devvit
Devvit.addCustomPostType({
  name: "PVP Hangman",
  height: "tall",
  render: (context) => {
    const [game, setGame] = useState<Game | null>(null);

    const progressChannel = useChannel<any>({
      name: "join_game",
      onMessage: (msg: { game: Game }) => {
        console.log(msg);
        setGame(msg.game);

        // Notify player 1
        if (game?.gameId == msg.game.gameId)
          webView.postMessage({
            type: "opponent_joined",
            data: { game: msg.game },
          });
      },
      onSubscribed: async () => {},
    });
    progressChannel.subscribe();

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
            setGame(createdGame);
            webView.postMessage({
              type: "game_created",
              data: { game: createdGame },
            });
            break;

          case "join_game":
            const joinedGame = await joinGame(context, message.data.gameId);
            setGame(joinedGame);
            webView.postMessage({
              type: "game_joined",
              data: { game: joinedGame },
            });
            break;

          default:
            console.error(`Unknown message type: ${message.type}`);
        }
      },
      onUnmount() {
        context.ui.showToast("Web view closed!");
      },
    });

    // Render the custom post type
    return (
      <vstack grow padding="small">
        <vstack grow alignment="middle center">
          <text size="xxlarge" weight="bold">
            Hangman Game
          </text>
          <text size="large" weight="bold">
            Be the first to guess your opponent's word!
          </text>
          <spacer />
          <spacer />
          <button onPress={() => webView.mount()} appearance="primary">
            Launch App
          </button>
        </vstack>
      </vstack>
    );
  },
});

export default Devvit;
