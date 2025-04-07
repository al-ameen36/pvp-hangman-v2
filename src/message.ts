import { Game } from "./types.js";

export type WebViewMessage =
  | { type: "webViewReady" }
  | { type: "create_game" }
  | { type: "join_game"; data: { gameId: string } }
  | any;

export type DevvitMessage =
  | { type: "initialData"; data: any }
  | { type: "game_created"; data: { game: Game | null } }
  | { type: "opponent_joined"; data: { game: Game | null } }
  | { type: "game_joined"; data: { game: Game | null } };
