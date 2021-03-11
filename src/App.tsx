import React, { useReducer } from "react";

import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { range, reverse, mapValues, } from "lodash";

import { Player } from './types';

import stateManager from "./stateManager";

import Checker from 'components/Checker';
import Cell from 'components/Cell';

import { boardSettings, } from "./config";
import { createBoardSetup, createInitialGameState, createDiagonals } from "utils/common";

import {
  AppHolder,
  BoardHolder,
  YRulerContainer,
  XRulerContainer,
  YRulerCell,
  XRulerCell,
  UndoButtonContainer
} from "./style";

/* - - - - - - - - - - - - - - - - - - - */

export const boardSetup = createBoardSetup();
export const diagonals = createDiagonals();

const { stateReducer, initialState } = stateManager(createInitialGameState(boardSetup));

function App() {
  const [{ gameState, gameHistory, gameStatePointer }, dispatchNewState] = useReducer(
    stateReducer,
    initialState
  );

  const findCheckerToCapture = (fromCellId: string, toCellId: string, fromPlayer: Player) => {

    // we are confident about finding the diagonal -> so make casting
    const diagonal = diagonals.find(dg => dg.includes(fromCellId) && dg.includes(toCellId)) as string[];

    let fromIndex = diagonal.indexOf(fromCellId);
    let toIndex = diagonal.indexOf(toCellId);

    // make iteration easier with only positive progression
    if (toIndex < fromIndex) {
      [fromIndex, toIndex] = [toIndex, fromIndex]
    }

    const k = toIndex < fromIndex ? -1 : 1;

    const checkersInRange = diagonal
      .slice(fromIndex + k, toIndex)
      .map(cellId => ({ cellId, cellState: gameState[cellId] }))
      .filter(({ cellState }) => {
        return cellState.belongsTo !== undefined && cellState.belongsTo !== fromPlayer
      });


    return checkersInRange[0]?.cellId;
  };

  const handleOnDrop = (fromCellId: string, fromPlayer: Player, toCellId: string) => {
    const opponentCheckerOnPromotionRange = findCheckerToCapture(fromCellId, toCellId, fromPlayer);

    const kingTransformationCellsMap = {
      light: ["b8", "d8", "f8", "h8"],
      dark: ["a1", "c1", "e1", "g1"]
    };

    const updatedState = mapValues(gameState, (cellState, cellId) => {
      const variantsMap = {
        [fromCellId]: { ...cellState, belongsTo: undefined },
        [opponentCheckerOnPromotionRange]: { ...cellState, belongsTo: undefined },
        [toCellId]: {
          ...cellState,
          belongsTo: fromPlayer,
          isKing: gameState[fromCellId].isKing || kingTransformationCellsMap[fromPlayer].includes(toCellId)
        }
      };

      const actionIsValid = Object.keys(variantsMap).includes(cellId);

      return actionIsValid ? variantsMap[cellId] : cellState;
    });

    dispatchNewState({ type: "SET_BASIC_MOVE", updatedState })
  };

  /* - - - - - - - - Renderers - - - - - - - - - - */

  const renderCells = () => {
    return boardSetup.map((cell) => {
      const { x, y, id, color } = cell;

      const cellUI = {
        top: (boardSettings.cellsNumber - y) * boardSettings.cellWidth,
        left: boardSettings.alphabet.indexOf(x) * boardSettings.cellWidth,
        color: boardSettings.colors[color],
      };

      const cellState = gameState[id];

      return (
        <Cell
          cellId={id}
          key={id}
          ui={cellUI}
          onDrop={handleOnDrop}
          gameState={gameState}
          cellBelongsTo={cellState.belongsTo}
        >
          <Checker cellId={id} cellState={cellState} />
        </Cell>
      );
    });
  };

  const renderXRuler = () => {
    const { alphabet, cellWidth } = boardSettings;

    return (
      <XRulerContainer>
        {alphabet.map((char) => {
          return (
            <XRulerCell
              key={char}
              left={alphabet.indexOf(char) * cellWidth}
            >
              {char}
            </XRulerCell>
          );
        })}
      </XRulerContainer>
    );
  };

  const renderYRuler = () => {
    const { cellsNumber, cellWidth } = boardSettings;

    return (
      <YRulerContainer>
        {reverse(range(0, cellsNumber)).map((key: number, i: number) => {
          return (
            <YRulerCell key={key} top={key * cellWidth}>
              {i + 1}
            </YRulerCell>
          );
        })}
      </YRulerContainer>
    );
  };

  /* - - - - - - - - - - - - - - - - - - - - - - */
  return (
    <AppHolder>
      <DndProvider backend={HTML5Backend}>
        <BoardHolder>
          {renderYRuler()}
          {renderXRuler()}

          {renderCells()}
        </BoardHolder>
      </DndProvider>

      <UndoButtonContainer>
        <button
          disabled={gameHistory.length === 1}
          onClick={() => {
            dispatchNewState({
              type: "UNDO",
              updatedPointer: gameStatePointer - 1
            });
          }}
        >
          Undo
        </button>
      </UndoButtonContainer>
    </AppHolder>
  );
}

export default App;
