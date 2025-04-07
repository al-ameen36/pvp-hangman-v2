import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { Game } from "../../types";

type GameData = {
  game: Game | null;
};

const initialState: GameData = {
  game: null,
};

export const gameSlice = createSlice({
  name: "game",
  initialState,
  reducers: {
    setGame: (state, action) => {
      state.game = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setGame } = gameSlice.actions;
export const selectGame = (state: RootState) => state.game.game;

export default gameSlice.reducer;
