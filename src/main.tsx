import "./createPost.js";

import { Devvit, useState, useWebView } from "@devvit/public-api";

import type { DevvitMessage, WebViewMessage } from "./message.js";

Devvit.configure({
  redditAPI: true,
  redis: true,
});

// Add a custom post type to Devvit
Devvit.addCustomPostType({
  name: "PVP Hangman",
  height: "tall",
  render: (context) => {
    const [username] = useState(async () => {
      return (await context.reddit.getCurrentUsername()) ?? "anon";
    });
    const webView = useWebView<WebViewMessage, DevvitMessage>({
      url: "index.html",

      // Handle messages sent from the web view
      async onMessage(message, webView) {
        switch (message.type) {
          case "webViewReady":
            console.log("Current user: " + username);
            webView.postMessage({
              type: "initialData",
              data: "hello world",
            });
            break;
          default:
            throw new Error(`Unknown message type: ${message}`);
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
