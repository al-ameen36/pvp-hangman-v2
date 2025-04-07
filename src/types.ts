// export type Player = {
//   score: number;
//   username: string;
// };

// export type Team = {
//   name: string;
//   guesses: string[];
//   members: Player[];
//   score: number;
//   word: string;
// };

// export type Game = {
//   currentTurn: string;
//   name: string;
//   team1: Player[];
//   team2: Player[];
//   time: number;
//   winner: string;
// };

// export type GameCreated = {
//   gameId: string;
// };

export type Player = {
  id: string;
  username: string;
} | null;

export type Game = {
  gameId: string;
  team1: Player;
  team2: Player;
};
