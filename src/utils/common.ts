import { boardSettings, players } from "config";

import { CellParams, GameState, Player } from "types";

/* - - - - - - - - - - - - - - - - - - - */

type BoardSetup = CellParams[];

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
        color: (isDarkColor ? players.dark : players.light) as Player,
      });

      isDarkColor = !isDarkColor;
    }

    isDarkColor = !isDarkColor;
  }

  return boardSetup;
}

export function createInitialGameState(boardSetup: BoardSetup): GameState {
  const lightPlayerHorizontals = [1, 2, 3];
  const darkPlayerHorizontals = [6, 7, 8];
  const initialHorizontals = [...lightPlayerHorizontals, ...darkPlayerHorizontals];

  return boardSetup.reduce((state: object, { id, y, color }: CellParams) => {
    const cellIsRelevant = color === players.dark && initialHorizontals.includes(y);
    const belongsTo = cellIsRelevant
      ? darkPlayerHorizontals.includes(y) ? players.dark : players.light
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

