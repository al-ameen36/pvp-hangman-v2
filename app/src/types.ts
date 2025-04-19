export type Player = {
  id: string;
  username: string;
  word: string;
} | null;

export type Game = {
  gameId: string;
  team1: Player;
  team2: Player;
};
