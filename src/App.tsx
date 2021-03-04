import React, { useState } from "react";

import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

import {
  range,
  reverse,
  flatten,
  mapValues,
  isEmpty
} from "lodash";

import { CellParams, GameState, Player, OnDropPayload } from './types';

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
* - Possible moves highlighting ✅
* - Capturing enemy checker ✅
* - Allow only move forward ✅
* - King checkers mechanic
* - Additional logic: undo-redo, score etc.
* - Complete typing
* - Unit tests for utils?
* - Create diagonals programmatically
* LAST: Structure organization & refactoring, refactoring styles
*
* */
/* - - - - - - - - - - - - - - - - - - - */


// TODO: types
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
      isKing={cellState.isKing}
      isLightColor={cellState.belongsTo === "light"}
      style={{ opacity: isDragging ? 0.5 : 1, }}
    />
  )
}

// FIXME types
type CellComponentProps = {
  cellId: string;
  ui: any; // FIXME
  onDrop: any; // FIXME
  gameState: GameState;
  cellBelongsTo?: Player;
  children: React.ReactNode;
};

type dropHandleProps = {
  fromCellId: string;
  toCellId: string;
  fromPlayer: Player;
  gameState: GameState;
  cellBelongsTo?: string;
}

function canDropHandler(props: dropHandleProps) {
  const { fromCellId, toCellId, fromPlayer, gameState, cellBelongsTo } = props;

  const validDiagonals = diagonals.filter(dg => dg.includes(fromCellId));
  const { isKing } = gameState[fromCellId];

  const validDiagonalsWithValidCells = validDiagonals.map(diagonal => {
    const indexOfInitialCell = diagonal.indexOf(fromCellId);

    return diagonal.filter((cell, i) => {
      const direction = i < indexOfInitialCell ? "bottom" : "top";
      const promotionRangeVariant = Math.abs(i - indexOfInitialCell);

      if (isKing) {
        // TODO: if on that direction no own cells in between or two checkers are next to each other
        return cellBelongsTo === undefined;
      }

      if (promotionRangeVariant === 1) {
        switch (fromPlayer) {
          case "dark":
            return direction === "bottom";
          case "light":
            return direction === "top";
        }
      }

      if (promotionRangeVariant === 2) {
        const k = direction === "top" ? 1 : -1;
        const nextCellState = diagonal[indexOfInitialCell + k]
          && gameState[diagonal[indexOfInitialCell + k]];

        if (nextCellState) {
          return nextCellState.belongsTo !== undefined
            && nextCellState.belongsTo !== fromPlayer;
        }
      }

      return false;
    });
  });

  return flatten(validDiagonalsWithValidCells).includes(toCellId) && cellBelongsTo === undefined;
}

function CellComponent({ cellId, ui, onDrop, cellBelongsTo, gameState, children }: CellComponentProps) {
  const [{ isOver, canDrop }, drop] = useDrop(
    () => ({
      accept: "checker",
      drop: ({ fromCellId, fromPlayer }: OnDropPayload) => onDrop(fromCellId, fromPlayer, cellId),
      canDrop: ({ fromCellId, fromPlayer }) => canDropHandler({
        fromCellId,
        toCellId: cellId,
        fromPlayer,
        gameState,
        cellBelongsTo
      }),
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

/* - - - - - - - - - - - - - - - - - - - */
/* - - - - - - - - - - - - - - - - - - - */

const boardSetup = createBoardSetup();
const initialGameState = createInitialGameState(boardSetup);

const diagonals = createDiagonals();

type findCheckerToCaptureProps = {
  fromCellId: string;
  toCellId: string;
  fromPlayer: Player;
}

function App() {
  const [gameState, commitGameStateChange] = useState<GameState>(initialGameState);

  const findCheckerToCapture = (props: findCheckerToCaptureProps) => {
    const { fromCellId, toCellId, fromPlayer } = props;

    // we are confident about finding the diagonal -> so make casting
    const diagonal = diagonals.find(dg => dg.includes(fromCellId) && dg.includes(toCellId)) as string[];

    let fromIndex = diagonal.indexOf(fromCellId);
    let toIndex = diagonal.indexOf(toCellId);

    // make iteration easier with only positive progression
    if (toIndex < fromIndex) {
      [fromIndex, toIndex] = [toIndex, fromIndex]
    }

    for (let i = fromIndex + 1; i < toIndex; i++) {
      const cellId = diagonal[i];
      const cellState = gameState[cellId];

      if (cellState && cellState.belongsTo !== undefined && cellState.belongsTo !== fromPlayer) {
        return cellId;
      }
    }
  };

  const handleOnDrop = (fromCellId: string, fromPlayer: Player, toCellId: string) => {
    const opponentCheckerOnPromotionRange = findCheckerToCapture({ fromCellId, toCellId, fromPlayer }) as string;

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

      return Object.keys(variantsMap).includes(cellId) ? variantsMap[cellId] : cellState;
    });

    commitGameStateChange(updatedState);
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
