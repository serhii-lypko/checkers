import React, { useState } from "react";

import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

import {
  range,
  reverse,
  flatten,
  mapValues
} from "lodash";

import { CellParams, GameState, Player, CellState, OnDropPayload } from './types';

// import { CellConfig, PlayersState, ActivePromotion, PromotionType, Player } from "./types";

import {
  boardSettings,
  // players
} from "./config";
import {
  createBoardSetup,
  createInitialGameState,
  createDiagonals,
  // getPlayersCheckersIds,
  findElementBetween,
} from "./utils";

import {
  AppHolder,
  BoardHolder,
  Cell,
  Overlay,
  Checker,
  YRulerContainer,
  XRulerContainer,
  YRulerCell,
  XRulerCell,
  // ControlsHolder,
  // LastMoveByHolder,
  // MockCell,
} from "./style";

// TODO: main -> implement typescript with NO IMPLICIT ANY


/* - - - - - - - - - - - - - - - - - - - */
/*
* 0. Possible moves highlighting ✅
* 1. Capturing enemy checker
* 2. Allow moves depends who moved last -> observing captures
* 3. Create diagonals programmatically
* 4. King checkers mechanic
* 5. Allow only move forward
* 6. Additional logic: undo-redo, score etc.
* 7. Complete typing
* N. Unit tests for utils?
* LAST: Structure organization & refactoring, refactoring styles
*
* */
/* - - - - - - - - - - - - - - - - - - - */

type CheckerComponentProps = any; // FIXME
function CheckerComponent({ cellId, cellState }: CheckerComponentProps) {
  const [{ isDragging }, drag] = useDrag(() => ({
    item: { type: "checker", fromCellId: cellId, fromPlayer: cellState.belongsTo },
    collect: (monitor) => ({ isDragging: monitor.isDragging() })
  }), [cellState, cellId]);

  if (!cellState || !cellState.belongsTo) return <div />;

  return (
    <Checker
      ref={drag}
      isLightColor={cellState.belongsTo === "light"}
      style={{ opacity: isDragging ? 0.5 : 1, }}
    />
  )
}

type CellComponentProps = {
  cellId: string;
  ui: any; // FIXME
  onDrop: any; // FIXME
  gameState: GameState;
  cellBelongsTo?: Player;
  children: React.ReactNode;
};

// TODO: typing params to make shorter notation
function canDropHandler(fromCellId: string, toCellId: string, fromPlayer: Player, gameState: GameState, cellBelongsTo?: string) {
  const validDiagonals = diagonals.filter(dg => dg.includes(fromCellId));

  const { isKing } = gameState[fromCellId];

  const validDiagonalsWithValidCells = validDiagonals.map(diagonal => {
    const indexOfInitialCell = diagonal.indexOf(fromCellId);

    return diagonal.filter((cell, i) => {
      const promotionRangeAttempt = Math.abs(i - indexOfInitialCell);

      if (isKing) {
        // TODO
        return true;
      }

      switch (promotionRangeAttempt) {
        case 1:
          return true;
        case 2:
          const k = fromPlayer === "dark" ? -1 : 1;
          const cellInBetweenId = diagonal[indexOfInitialCell + k];
          const { belongsTo } = gameState[cellInBetweenId];

          return belongsTo !== undefined && belongsTo !== fromPlayer;
      }


      // if (Math.abs(delta) === 2) {
      //   const k = fromPlayer === "dark" ? -1 : 1;
      //   const cellInBetweenId = diagonal[indexOfInitialCell + k];
      //   const cellInBetweenState = gameState.find(cellState => cellState.id === cellInBetweenId);
      //
      //   return cellInBetweenState?.owner !== undefined && cellInBetweenState?.owner !== fromPlayer;
      // }
      //
      // return Math.abs(delta) === 1;
    });
  });

  return flatten(validDiagonalsWithValidCells).includes(toCellId) && cellBelongsTo === undefined;
}

function CellComponent({ cellId, ui, onDrop, cellBelongsTo, gameState, children }: CellComponentProps) {
  const [{ isOver, canDrop }, drop] = useDrop(
    () => ({
      accept: "checker",
      drop: ({ fromCellId, fromPlayer }: OnDropPayload) => onDrop(fromCellId, fromPlayer, cellId),
      canDrop: ({ fromCellId, fromPlayer }) => canDropHandler(
        fromCellId,
        cellId,
        fromPlayer,
        gameState,
        cellBelongsTo
      ),
      collect: (monitor) => ({
        isOver: monitor.isOver(),
        canDrop: monitor.canDrop()
      })
    }),
    [cellId, onDrop, cellBelongsTo, gameState]
  );

  return (
    <Cell ref={drop} ui={ui} className="cell">
      {children}
      {!isOver && canDrop && <Overlay className="overlay" />}
      {isOver && canDrop && <Overlay isDarkerBackground className="overlay" />}
    </Cell>
  )
}

const boardSetup = createBoardSetup();
const initialGameState = createInitialGameState(boardSetup);

const diagonals = createDiagonals();

function App() {
  const [gameState, commitGameStateChange] = useState<GameState>(initialGameState);

  const handleOnDrop = (fromCellId: string, fromPlayer: Player, toCellId: string) => {
    const dropDiagonal = diagonals.find(dg => dg.includes(fromCellId) && dg.includes(toCellId));
    const elementInBetweenId = findElementBetween(dropDiagonal, fromCellId, toCellId);

    const updatedState = mapValues(gameState, (cellState, key) => {
      const variantsMap = {
        [fromCellId]: { ...cellState, belongsTo: undefined },
        [elementInBetweenId]: { ...cellState, belongsTo: undefined },
        [toCellId]: { ...cellState, belongsTo: fromPlayer }
      };

      return Object.keys(variantsMap).includes(key) ? variantsMap[key] : cellState;
    });

    commitGameStateChange(updatedState);
  };

  /* - - - - - - - - - Renderers - - - - - - - - - - */

  const renderYRuler = () => {
    const { cellsNumber, cellWidth } = boardSettings;

    return (
      <YRulerContainer className="y-ruler-container">
        {reverse(range(0, cellsNumber)).map((key: number, i: number) => {
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
            <XRulerCell
              key={char}
              left={alphabet.indexOf(char) * cellWidth}
              className="x-ruler-cell"
            >
              {char}
            </XRulerCell>
          );
        })}
      </XRulerContainer>
    );
  };

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
        <CellComponent
          cellId={id}
          key={id}
          ui={cellUI}
          onDrop={handleOnDrop}
          gameState={gameState}
          cellBelongsTo={cellState.belongsTo}
        >
          <CheckerComponent cellId={id} cellState={cellState} />
        </CellComponent>
      );
    });
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

      {/*<LastMoveByHolder className="last-move-by">*/}
      {/*  <MockCell className="mock-cell">*/}
      {/*    {lastMoveBy && <Checker isLightColor={lastMoveBy === "white"} isInPromotion={false} />}*/}
      {/*  </MockCell>*/}
      {/*  <span>last step from</span>*/}
      {/*</LastMoveByHolder>*/}

      {/*<ControlsHolder className="controls-holder">*/}
      {/*  <button onClick={handleResetAction}>Reset</button>*/}
      {/*  <button>Back</button>*/}
      {/*  <button>Forward</button>*/}
      {/*</ControlsHolder>*/}
    </AppHolder>
  );
}

export default App;
