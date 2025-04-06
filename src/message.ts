export type WebViewMessage =
  | { type: "webViewReady" }
  | { type: "create_game" }
  | { type: "join_game"; gameId: string };

export type DevvitMessage =
  | { type: "initialData"; data: any }
  | { type: "game_created"; data: { gameId: string } };
