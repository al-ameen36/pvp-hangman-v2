import { Devvit } from "@devvit/public-api";

// Adds a new menu item to the subreddit allowing to create a new post
Devvit.addMenuItem({
  label: "Play PVP Hangman",
  location: "subreddit",
  onPress: async (_event, context) => {
    const { reddit, ui } = context;
    const subreddit = await reddit.getCurrentSubreddit();
    const post = await reddit.submitPost({
      title: "PVP Hangman",
      subredditName: subreddit.name,
      // The preview appears while the post loads
      preview: (
        <vstack height="100%" width="100%" alignment="middle center">
          <text size="large">Loading ...</text>
        </vstack>
      ),
    });
    ui.showToast({ text: "Game starting" });
    ui.navigateTo(post);
  },
});
