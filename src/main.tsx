import "./createPost.js";
import { Devvit, useChannel, useState, useWebView } from "@devvit/public-api";
import type { DevvitMessage, WebViewMessage } from "./message.js";

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
    const key = (postId: string | undefined): string => {
      return `user_turn_state:${postId}`;
    };

    const [gameId, setGameId] = useState(async () => {
      const state = await context.redis.get(key(context.postId));
      return state || "me";
    });

    // // Store the progress state keyed by post ID
    // const [lastTurn, setLastTurn] = useState(async () => {
    //   const state = await context.redis.get(key(context.postId));
    //   return state || "me";
    // });

    // const mySession = generateSessionId();

    // TODO
    // Generate game id
    // allow user to join game

    // const [me] = useState<UserRecord | null>(async () => {
    //   const user = await context.reddit.getCurrentUser();
    //   if (!user) return null;
    //   return {
    //     id: user.id,
    //     name: user.username,
    //   };
    // });

    const progressChannel = useChannel<any>({
      name: "join_game",
      onMessage: (msg) => {
        console.log(msg);
      },
      onSubscribed: async () => {},
    });
    progressChannel.subscribe();

    const webView = useWebView<WebViewMessage, DevvitMessage>({
      url: "index.html",

      // Handle messages sent from the web view
      // async onMessage(message, webView) {
      async onMessage(message) {
        switch (message.type) {
          case "webViewReady":
            console.log("Game Ready");
            break;
          case "create_game":
            setGameId(generateGameId());
            console.log(gameId);

            webView.postMessage({
              type: "game_created",
              data: { gameId },
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
