import { boardSettings } from "./config";
import { Player, PlayersState, PlayerChecker, CellConfig, BoardConfig } from "./types";

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

export function createInitialPlayersStateConfig(
  args: CreateInitialPlayersStateConfig,
): PlayersState {
  const { boardConfig, diagonalsCreator } = args;
  const { cellsNumber } = boardSettings;

  // const diagonals = diagonalsCreator();

  // TODO: create initial checkers collection programmatically

  const white: PlayerChecker[] = [
    { id: "a1", kind: "default" },
    { id: "b2", kind: "default" },
    { id: "a3", kind: "default" },
    { id: "c1", kind: "default" },
    { id: "d2", kind: "default" },
    { id: "c3", kind: "default" },
    { id: "e1", kind: "default" },
    { id: "f2", kind: "default" },
    { id: "e3", kind: "default" },
    { id: "g1", kind: "default" },
    { id: "h2", kind: "default" },
    { id: "g3", kind: "default" },
  ];

  const black: PlayerChecker[] = [
    { id: "a7", kind: "default" },
    { id: "b8", kind: "default" },
    { id: "b6", kind: "default" },
    { id: "c7", kind: "default" },
    { id: "d8", kind: "default" },
    { id: "d6", kind: "default" },
    { id: "e7", kind: "default" },
    { id: "f8", kind: "default" },
    { id: "f6", kind: "default" },
    { id: "g7", kind: "default" },
    { id: "h8", kind: "default" },
    { id: "h6", kind: "default" },
  ];

  return { white, black };
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

export function getPlayersCheckersIds(players: PlayersState) {
  const { white, black } = players;

  const whitePlayerCheckers = white.map((checkerConfig) => checkerConfig.id);
  const blackPlayerCheckers = black.map((checkerConfig) => checkerConfig.id);

  return {
    whitePlayerCheckers,
    blackPlayerCheckers,
  };
}

export function findElementBetween<T>(list: Array<T>, first: T, last: T) {
  const indexOfFirstEl = list.indexOf(first);
  const indexOfLastEl = list.indexOf(last);
  const indexOfElementBetween = (indexOfFirstEl + indexOfLastEl) / 2;

  return list[indexOfElementBetween];
}
