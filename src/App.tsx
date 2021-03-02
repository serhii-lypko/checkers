import React, { useState } from "react";

import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

import {
  range,
  reverse,
  // flatten
} from "lodash";

import { CellParams, Player, CellState, OnDropPayload } from './types';

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
  // findElementBetween,
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
* 1. Possible moves highlighting ✅
* 2. Capturing enemy checker
* 3. Create diagonals programmatically
* 4. King checkers mechanic
* 5. Allow only move forward
* 6. Additional logic: undo-redo, score etc.
* 7. Complete typing
* N. Unit tests for utils?
* F. Make any optimizations?
* LAST: Structure organization & refactoring
*
* */
/* - - - - - - - - - - - - - - - - - - - */


type CheckerComponentProps = any; // FIXME
function CheckerComponent({ cellState }: CheckerComponentProps) {
  const [{ isDragging }, drag] = useDrag(() => ({
    item: { type: "checker", fromCellId: cellState.id, fromPlayer: cellState.owner },
    collect: (monitor) => ({
      isDragging: monitor.isDragging()
    })
  }), [cellState]);

  if (!cellState || !cellState.owner) return <div />;

  return (
    <Checker
      ref={drag}
      isLightColor={cellState.owner === "light"}
      style={{ opacity: isDragging ? 0.5 : 1, }}
    />
  )
}

type CellComponentProps = {
  id: string;
  ui: any; // FIXME
  onDrop: any; // FIXME
  gameState: CellState[];
  children: React.ReactNode;
  diagonals: Array<string[]>;
};
function CellComponent({ id, ui, onDrop, gameState, diagonals, children }: CellComponentProps) {
  const [{ isOver, canDrop }, drop] = useDrop(
    () => ({
      accept: "checker",
      drop: ({ fromCellId, fromPlayer }: OnDropPayload) => onDrop(fromCellId, fromPlayer, /*toCellId: */id),
      canDrop: ({ fromCellId }) => {
        // TODO: place all this logic into separate method?
        const validDiagonals = diagonals.filter(dg => dg.includes(fromCellId));
        const validCells = validDiagonals.reduce((cells: string[], diagonal: string[]) => {
          return [...cells, ...diagonal];
        }, []);

        const cellIsTaken = !!gameState.find(cellState => cellState.id === id)?.owner;

        return validCells.includes(id) && !cellIsTaken; // TODO: allow to make moves only forward
      },
      collect: (monitor) => ({
        isOver: monitor.isOver(),
        canDrop: monitor.canDrop()
      })
    }),
    [id, onDrop, gameState]
  );

  return (
    <Cell ref={drop} ui={ui} className="cell">
      {children}
      {!isOver && canDrop && <Overlay className="overlay" />}
    </Cell>
  )
}

const boardSetup = createBoardSetup();
const initialGameState = createInitialGameState(boardSetup);

const diagonals = createDiagonals();

function App() {
  const [gameState, commitGameStateChange] = useState<CellState[]>(initialGameState);

  const handleOnDrop = (fromCellId: string, fromPlayer: Player, toId: string) => {
    const updatedState = gameState.map(cellState => {
      if (cellState.id === toId) {
        return {
          ...cellState,
          owner: fromPlayer
        }
      }

      if (cellState.id === fromCellId) {
        return {
          ...cellState,
          owner: undefined
        }
      }

      return cellState;
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

      const cellState = gameState.find(gameStateCell => gameStateCell.id === id);

      return (
        <CellComponent
          id={id}
          key={id}
          ui={cellUI}
          onDrop={handleOnDrop}
          gameState={gameState}
          diagonals={diagonals}
        >
          <CheckerComponent cellState={cellState} />
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
