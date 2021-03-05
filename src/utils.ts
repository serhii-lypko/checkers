import { boardSettings } from "./config";
// import { Player, PlayersState, PlayerChecker, CellConfig, BoardConfig } from "./types";

import { CellParams, GameState, Player } from "./types";

type BoardSetup = CellParams[];

// TODO: ideally -> write unit tests for each util function (since they are pure, right?)

/* - - - - - - - - - - - - - - - - - - - */

export function createBoardSetup() {
  const { alphabet } = boardSettings;

  let boardSetup: BoardSetup = [];
  let isDarkColor = false;

  for (let y = 8; y >= 1; y--) {
    for (let k = 0; k < alphabet.length; k++) {
      const x = alphabet[k];

      boardSetup.push({
        x,
        y,
        id: `${x}${y}`,
        color: (isDarkColor ? "dark" : "light"), // TODO: make as a constants
      });

      isDarkColor = !isDarkColor;
    }

    isDarkColor = !isDarkColor;
  }

  return boardSetup;
}


// TODO: use dark | light as constants
export function createInitialGameState(boardSetup: BoardSetup): GameState {
  const lightPlayerHorizontals = [1, 2, 3];
  const darkPlayerHorizontals = [6, 7, 8];
  const initialHorizontals = [...lightPlayerHorizontals, ...darkPlayerHorizontals];

  return boardSetup.reduce((state: object, { id, y, color }: CellParams) => {
    const cellIsRelevant = color === "dark" && initialHorizontals.includes(y);
    const belongsTo = cellIsRelevant
      ? darkPlayerHorizontals.includes(y) ? "dark" : "light"
      : undefined;

    return {
      ...state,
      [id]: {
        belongsTo: belongsTo as Player | undefined,
        isKing: false,
      }
    }
  }, {});
}

// TODO: create diagonals programmatically
export function createDiagonals() {
  // const { alphabet, cellsNumber } = boardConfig;

  return [
    ["g1", "h2"],
    ["e1", "f2", "g3", "h4"],
    ["c1", "d2", "e3", "f4", "g5", "h6"],
    ["a1", "b2", "c3", "d4", "e5", "f6", "g7", "h8"],
    ["a3", "b4", "c5", "d6", "e7", "f8"],
    ["a5", "b6", "c7", "d8"],
    ["a7", "b8"],

    ["c1", "b2", "a3"],
    ["e1", "d2", "c3", "b4", "a5"],
    ["g1", "f2", "e3", "d4", "c5", "b6", "a7"],
    ["h2", "g3", "f4", "e5", "d6", "c7", "b8"],
    ["h4", "g5", "f6", "e7", "d8"],
    ["h6", "g7", "f8"],
  ];
}

