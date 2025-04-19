import { Context, User } from "@devvit/public-api";
import { Game } from "./types.js";

export function generateGameId(): string {
  return (
    Math.random().toString(36).substring(2, 6) +
    "_" +
    Date.now().toString(36).slice(-4)
  );
}

export const createGame = (currentUser: User) => {
  const gameId = generateGameId();

  if (currentUser) {
    const gameData: Game = {
      gameId: gameId,
      team1: {
        id: currentUser.id,
        username: currentUser.username,
        word: null,
      },
      team2: null,
    };

    return gameData;
  }

  return null;
};

export const joinGame = async (currentUser: User, gameId: string) => {
  console.log(gameId);

  return null;
};

// export const chooseWord = async (
//   context: Context,
//   gameId: string,
//   word: string
// ) => {
//   const game = await context.redis.get(`game_${gameId}`);
//   if (!game) return null;

//   const currentUser = await context.reddit.getCurrentUser();
//   if (currentUser) {
//     const gameData: Game = toObject(game);

//     // Assign word to the right player
//     if (gameData.team1?.id == currentUser.id) gameData.team1.word = word;
//     else if (gameData.team2?.id == currentUser.id) gameData.team2.word = word;
//     else return null;

//     return gameData;
//   }

//   return null;
// };
