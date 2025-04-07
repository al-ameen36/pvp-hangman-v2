import { Context } from "@devvit/public-api";
import { Game } from "./types.js";

// Game
function generateGameId(): string {
  return (
    Math.random().toString(36).substring(2, 6) +
    "-" +
    Date.now().toString(36).slice(-4)
  );
}

const toObject = (data: string) => JSON.parse(data);
const toString = (data: any) => JSON.stringify(data);

export const getRedisGame = async (context: Context, gameId: string) => {
  const game = await context.redis.get(`game_${gameId}`);
  if (!game) return null;
  return toObject(game);
};

export const setRedisGame = async (context: Context, game: Game) => {
  const newGame = await context.redis.set(
    `game_${game.gameId}`,
    toString(game)
  );
  return newGame;
};

export const createGame = async (context: Context) => {
  const gameId = generateGameId();
  const currentUser = await context.reddit.getCurrentUser();

  if (currentUser) {
    const gameData: Game = {
      gameId: gameId,
      team1: {
        id: currentUser.id,
        username: currentUser.username,
      },
      team2: null,
    };

    await setRedisGame(context, gameData);
    return gameData;
  }

  return null;
};

export const joinGame = async (context: Context, gameId: string) => {
  const game = await context.redis.get(`game_${gameId}`);
  if (!game) return null;

  const currentUser = await context.reddit.getCurrentUser();
  if (currentUser) {
    const gameData: Game = toObject(game);

    // Prevent same user from joining as both players
    if (gameData.team1?.id == currentUser.id) return null;
    gameData.team2 = {
      id: currentUser.id,
      username: currentUser.username,
    };

    await setRedisGame(context, gameData);
    return gameData;
  }

  return null;
};
