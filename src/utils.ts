import range from "lodash/range";

import { boardSettings } from "./config";
import { CellColor, CellConfig, BoardConfig } from "./types";

/* - - - - - - - - Board config - - - - - - - - - - */

function createInitialBoardConfig() {
  const { alphabet, colors } = boardSettings;

  let initialBoardState: Array<CellConfig> = [];

  let colorFlag = false;

  for (let y = 8; y >= 1; y--) {
    for (let k = 0; k < alphabet.length; k++) {
      const x = alphabet[k];

      initialBoardState.push({
        coordinates: { x, y }, //TODO: is it useful?
        shortand: `${x}${y}`,
        color: (colorFlag ? colors.black : colors.white) as CellColor,
      });

      colorFlag = !colorFlag;
    }

    colorFlag = !colorFlag;
  }

  return initialBoardState;
}

export const boardConfig = createInitialBoardConfig();

/* - - - - - - - - - Players state config - - - - - - - - - - */

type CreateInitialPlayersStateConfig = {
  boardConfig: BoardConfig;
  diagonalsCreator: () => Array<string[]>;
};

export function createInitialPlayersStateConfig(args: CreateInitialPlayersStateConfig) {
  const { boardConfig, diagonalsCreator } = args;
  const { cellsNumber } = boardSettings;

  const diagonals = diagonalsCreator();

  const chars = ["a", "b", "c", "d", "e", "f", "g", "h"];

  // console.log("diagonals: ", diagonals);

  // TODO: create initial checkers set programmatically

  const initialCheckers = 12;

  let w = [];

  for (let i = 1; i <= cellsNumber / 2; i++) {
    // for (let j = 0; j <= 3; j++) {
    //   w.push()
    // }
  }

  const whitePlayerCheckers = ["a1", "b2", "a3", "c1", "d2", "c3", "e1", "f2", "e3", "g1", "h2", "g3"];

  const blackPlayerCheckers = ["a7", "b8", "b6", "c7", "d8", "d6", "e7", "f8", "f6", "g7", "h8", "h6"];

  return { whitePlayerCheckers, blackPlayerCheckers };
}

export const initialPlayersStateConfig = createInitialPlayersStateConfig({
  boardConfig,
  diagonalsCreator: createDiagonals,
});

/* - - - - - - - - - Sub utils - - - - - - - - - - */

export function createDiagonals() {
  // const { alphabet, cellsNumber } = boardConfig;

  // const exampleChars = ["a", "b", "c", "d", "e", "f", "g", "h"];

  // TODO: create diagonals programmatically

  // let set1 = [
  //   ["a7", "b8"],
  //   ["a5", "b6", "c7", "d8"],
  //   ["a3", "b4", "c5", "d6", "e7", "f8"],
  //
  //   ["a1", "b2", "c3", "d4", "e5", "f6", "g7", "h8"],
  //
  //   ["c1", "d2", "e3", "f4", "g5", "h6"],
  //   ["e1", "f2", "g3", "h4"],
  //   ["g1", "h2"],
  // ];

  // let set2 = [
  //   ["a3", "b2", "c1"],
  //   ["a5", "b4", "c3", "d2", "e1"],
  //
  //   ["a7", "b6", "c5", "d4", "e3", "f2", "g1"],
  //   ["b8", "c7", "d6", "e5", "f4", "g3", "h2"],
  //
  //   ["d8", "e7", "f6", "g5", "h4"],
  //   ["f8", "g7", "h5"],
  // ];

  return [
    ["a7", "b8"],
    ["a3", "b2", "c1"],
    ["a5", "b6", "c7", "d8"],
    ["a5", "b4", "c3", "d2", "e1"],
    ["a3", "b4", "c5", "d6", "e7", "f8"],

    ["a7", "b6", "c5", "d4", "e3", "f2", "g1"],
    ["a1", "b2", "c3", "d4", "e5", "f6", "g7", "h8"],
    ["b8", "c7", "d6", "e5", "f4", "g3", "h2"],

    ["c1", "d2", "e3", "f4", "g5", "h6"],
    ["d8", "e7", "f6", "g5", "h4"],
    ["e1", "f2", "g3", "h4"],
    ["f8", "g7", "h5"],
    ["g1", "h2"],
  ];
}
