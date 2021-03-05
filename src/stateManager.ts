import { GameState } from "./types";

type State = {
  gameState: GameState,
  gameHistory: GameState[],
  gameStatePointer: number
}

type Action =
  | { type: "SET_BASIC_MOVE", updatedState: GameState }
  | { type: "UNDO", updatedPointer: number }

function stateManager(initialGameState: GameState) {
  const stateReducer = (state: State, action: Action) => {
    switch (action.type) {
      case "SET_BASIC_MOVE":
        return {
          ...state,
          gameState: action.updatedState,
          gameHistory: [...state.gameHistory, action.updatedState],
          gameStatePointer: state.gameStatePointer + 1
        };

      case "UNDO":
        return {
          ...state,
          gameState: state.gameHistory[action.updatedPointer - 1],
          gameHistory: state.gameHistory.slice(0, action.updatedPointer),
          gameStatePointer: action.updatedPointer
        };
    }
  };

  const initialState = {
    gameState: initialGameState,
    gameHistory: [initialGameState],
    gameStatePointer: 1
  };

  return {
    stateReducer,
    initialState
  }
}

export default stateManager;
