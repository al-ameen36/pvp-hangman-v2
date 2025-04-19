import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { Game } from "../../types";

type InitialState = {
  game: Game | null;
  isReady: boolean;
};

const initialState: InitialState = {
  game: null,
  isReady: false,
};

export const gameSlice = createSlice({
  name: "game",
  initialState,
  reducers: {
    setGame: (state, action) => {
      state.game = action.payload;
    },
    setIsReady: (state, action) => {
      state.isReady = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setGame, setIsReady } = gameSlice.actions;

export const selectGame = (state: RootState) => state.game.game;
export const selectIsReady = (state: RootState) => state.game.isReady;

export default gameSlice.reducer;
