import { boardSettings } from "./config";
import { Player, CellConfig, BoardConfig } from "./types";

/* - - - - - - - - Board config - - - - - - - - - - */

function createInitialBoardConfig() {
  const { alphabet, colors } = boardSettings;

  let initialBoardState: Array<CellConfig> = [];

  let colorFlag = false;

  for (let y = 8; y >= 1; y--) {
    for (let k = 0; k < alphabet.length; k++) {
      const x = alphabet[k];

      initialBoardState.push({
        coordinates: { x, y },
        id: `${x}${y}`,
        color: (colorFlag ? colors.black : colors.white) as Player,
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

  // const diagonals = diagonalsCreator();

  // TODO: create initial checkers collection programmatically

  const white = ["a1", "b2", "a3", "c1", "d2", "c3", "e1", "f2", "e3", "g1", "h2", "g3"];
  const black = ["a7", "b8", "b6", "c7", "d8", "d6", "e7", "f8", "f6", "g7", "h8", "h6"];

  return {
    white,
    black,
    // allPlayersCheckers: [...whitePlayerCheckers, ...blackPlayerCheckers],
  };
}

export const initialPlayersStateConfig = createInitialPlayersStateConfig({
  boardConfig,
  diagonalsCreator: createDiagonals,
});

/* - - - - - - - - - Sub utils - - - - - - - - - - */

export function createDiagonals() {
  // const { alphabet, cellsNumber } = boardConfig;

  // TODO: create diagonals programmatically

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

export function findElementBetween<T>(list: Array<T>, first: T, last: T) {
  const indexOfFirstEl = list.indexOf(first);
  const indexOfLastEl = list.indexOf(last);
  const indexOfElementBetween = (indexOfFirstEl + indexOfLastEl) / 2;

  return list[indexOfElementBetween];
}
