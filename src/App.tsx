import React, { useState, useCallback } from "react";
import { range, reverse } from "lodash";

import { CellConfig, PlayersConfig } from "./types";

import { boardSettings } from "./config";
import { boardConfig, initialPlayersStateConfig } from "./utils";

import {
  AppHolder,
  BoardHolder,
  Cell,
  Checker,
  YRulerContainer,
  XRulerContainer,
  YRulerCell,
  XRulerCell,
  ControlsHolder,
} from "./style";

/* - - - - - - - - - - - - - - - - - - - */
/* - - - - - - - - - - - - - - - - - - - */

// TODO: --> --> make it work, make it right, make it fast <-- <--

/* - - - - - - - - - - - - - - - - - - - */
/* - - - - - - - - - - - - - - - - - - - */

// TODO: XState?

// TODO.1: memoization of components (cells, checkers and so on)
// TODO.2: useCallback for handlers
// TODO.3: animated appearing of cells & checkers
// TODO.4: back & forward actions

/* - - - - - - - - - - - - - - - - - - - */

function App() {
  const [playersState, updatePlayersState] = useState<PlayersConfig>(initialPlayersStateConfig);

  /* - - - - - - - - - - - - - - - - - - - */

  const handleCellClick = useCallback((cell: CellConfig) => {
    // const updatedState = boardState.map((stateCell) => {
    //   if (cell.shortand === stateCell.shortand) {
    //     return {
    //       ...stateCell,
    //       state: boardConfig.colors.black,
    //     };
    //   }
    //
    //   return stateCell;
    // });
    //
    // updateBoardState(updatedState as CellConfig[]);
  }, []);

  /* - - - - - - - - - Rulers - - - - - - - - - - */

  const renderYRuler = () => {
    const { cellsNumber, cellWidth } = boardSettings;

    return (
      <YRulerContainer className="y-ruler-container">
        {reverse(range(0, cellsNumber)).map((key, i) => {
          return (
            <YRulerCell key={key} top={key * cellWidth} className="y-ruler-cell">
              {i + 1}
            </YRulerCell>
          );
        })}
      </YRulerContainer>
    );
  };

  const renderXRuler = () => {
    const { alphabet, cellWidth } = boardSettings;

    return (
      <XRulerContainer className="x-ruler-container">
        {alphabet.map((char) => {
          return (
            <XRulerCell key={char} left={alphabet.indexOf(char) * cellWidth} className="x-ruler-cell">
              {char}
            </XRulerCell>
          );
        })}
      </XRulerContainer>
    );
  };

  /* - - - - - - - - - - - - - - - - - - - */

  const renderCells = () => {
    if (!playersState) return null;

    return boardConfig.map((cell) => {
      const { shortand, color, coordinates } = cell;

      const yFactor = (boardSettings.cellsNumber - coordinates.y) * boardSettings.cellWidth;
      const xFactor = boardSettings.alphabet.indexOf(coordinates.x) * boardSettings.cellWidth;

      const cellUI = {
        top: yFactor,
        left: xFactor,
        color,
      };

      const { whitePlayerCheckers, blackPlayerCheckers } = playersState;

      const cellHasWhiteChecker = whitePlayerCheckers.includes(shortand);
      const cellHasBlackChecker = blackPlayerCheckers.includes(shortand);

      return (
        <Cell key={shortand} onClick={() => handleCellClick(cell)} ui={cellUI} className="cell">
          {(cellHasWhiteChecker || cellHasBlackChecker) && <Checker isLightColor={cellHasWhiteChecker} />}
        </Cell>
      );
    });
  };

  /* - - - - - - - - - - - - - - - - - - - - - - */
  /* - - - - - - - - - - - - - - - - - - - - - - */

  return (
    <AppHolder>
      <BoardHolder>
        {renderYRuler()}
        {renderXRuler()}

        {renderCells()}
      </BoardHolder>

      <ControlsHolder className="controls-holder">
        <button onClick={() => updatePlayersState(initialPlayersStateConfig)}>Reset</button>
        <button>Back</button>
        <button>Forward</button>
      </ControlsHolder>
    </AppHolder>
  );
}

export default App;
