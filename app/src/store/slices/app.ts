import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../store";

type GameData = {
  gameId: string;
};

const initialState: GameData = {
  gameId: "",
};

export const gameSlice = createSlice({
  name: "game",
  initialState,
  reducers: {
    setGameId: (state, action) => {
      state.gameId = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setGameId } = gameSlice.actions;
export const selectGameId = (state: RootState) => state.game.gameId;

export default gameSlice.reducer;
