import "./createPost.js";
import {
  Devvit,
  JSONValue,
  useChannel,
  User,
  useState,
  useWebView,
  UseWebViewResult,
} from "@devvit/public-api";
import type { DevvitMessage, WebViewMessage } from "./message.js";
import { createGame, generateGameId, joinGame } from "./utils.js";
import { ChannelMessage, Game, Player } from "./types.js";

Devvit.configure({
  redditAPI: true,
  redis: true,
  realtime: true,
});

// Add a custom post type to Devvit
Devvit.addCustomPostType({
  name: "PVP Hangman",
  height: "tall",
  render: (context) => {
    const [game, setGame] = useState<Game | null>(null);
    const [currentUser] = useState(async () => {
      return (await context.reddit.getCurrentUser()) ?? {};
    });

    // Subscribe to events
    const channel = useChannel({
      name: "hangman_pvp_events",
      onMessage: (message: ChannelMessage) => {
        console.log(message);
        if (message.data.gameId == game?.gameId) {
          const user = currentUser as User;
          switch (message.type) {
            case "join":
              if (game.team1?.id != user.id)
                setGame((prev) => {
                  return {
                    ...(prev as Game),
                    team2: { id: user.id, username: user.username, word: null },
                  };
                });
              break;
          }
        }
      },
      onSubscribed: () => {
        console.log("Subscribed");
      },
      onUnsubscribed: () => {
        console.log("Unsubscribed");
      },
    });
    channel.subscribe();

    const webView = useWebView<WebViewMessage, DevvitMessage>({
      url: "index.html",
      // Handle messages sent from the web view
      async onMessage(message, webView) {
        // Save webview for use in channels
        if (currentUser) {
          const user = currentUser as User;
          switch (message.type) {
            case "webViewReady":
              console.log("Game Ready");
              break;

            case "create_game":
              const newGame = createGame(currentUser as User);
              setGame(newGame);

              webView.postMessage({
                type: "game_created",
                data: {
                  game: newGame,
                },
              });
              break;

            case "join_game":
              const payload: Player = {
                id: user.id,
                username: user.username,
                word: null,
              };
              let joiningTeam: { team1: Player } | { team2: Player } =
                user.id == game?.team1?.id
                  ? { team1: payload }
                  : ({ team2: payload } as any);

              const joinedGame = { ...game, ...(joiningTeam as any) };
              setGame(joinedGame);

              webView.postMessage({
                type: "player_joined",
                data: {
                  game: joinedGame,
                },
              });
              channel.send({
                data: { gameId: message.data.gameId },
                type: "join",
              });
              break;

            case "choose_word":
              let updatedTeam: { team1: Player } | { team2: Player } =
                user.id == game?.team1?.id
                  ? {
                      team1: { ...game?.team1, word: message.data.word },
                    }
                  : ({
                      team2: { ...game?.team2, word: message.data.word },
                    } as any);

              const updatedGame = { ...game, ...(updatedTeam as any) };
              setGame(updatedGame);

              webView.postMessage({
                type: "player_ready",
                data: {
                  game: updatedGame,
                },
              });
              break;

            default:
              console.error(`Unknown message type: ${message.type}`);
          }
        }
      },
      onUnmount() {
        // Clean up
        context.ui.showToast("Web view closed!");
        channel.unsubscribe();
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
