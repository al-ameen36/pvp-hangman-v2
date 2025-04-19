export type Player = {
  id: string;
  username: string;
  word: string | null;
} | null;

export type Game = {
  gameId: string;
  team1: Player;
  team2: Player;
};

type ChannelData = { gameId: string };

export type ChannelMessage = { type: string; data: ChannelData };
