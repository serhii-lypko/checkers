import React from "react";

import { useDrop } from "react-dnd";
import { flatten, isEmpty, reverse } from "lodash";

import { GameState, OnDropPayload, Player, CellUI } from "types";

import { diagonals } from "App";

import { Cell, Overlay } from "./style";

/* - - - - - - - - - - - - - - - - - - - */

type CellComponentProps = {
  cellId: string;
  ui: CellUI;
  onDrop: Function;
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
      const isBottomDirection = i < indexOfInitialCell;

      // - - - - - 1. checking possible king options first - - - - -
      if (isKing) {
        let fromIndex = indexOfInitialCell;
        let toIndex = i;

        if (toIndex < fromIndex) {
          [fromIndex, toIndex] = [toIndex, fromIndex]
        }

        const cellsRange = diagonal
          .slice(fromIndex + 1, toIndex)
          .map(cellId => ({ cellId, cellState: gameState[cellId] }));

        // for king, checking first own checkers on range
        const hasOwnCheckerOnDirection = cellsRange
          .some(({ cellState }) => cellState.belongsTo === fromPlayer);
        if (hasOwnCheckerOnDirection) return false;

        // then checking variants with multiple opponent checkers on range
        const opponentCheckers = cellsRange
          .filter(({ cellState }) => cellState.belongsTo !== undefined && cellState.belongsTo !== fromPlayer);

        const checkersToCapture = isBottomDirection ? reverse(opponentCheckers) : opponentCheckers;

        if (!isEmpty(checkersToCapture)) {
          const [_, nextCheckerToCapture] = checkersToCapture;

          if (nextCheckerToCapture) {
            const indexOfNextChecker = diagonal.indexOf(nextCheckerToCapture.cellId);

            return cellBelongsTo === undefined
            && isBottomDirection ? i > indexOfNextChecker : i < indexOfNextChecker;
          }
        }

        return cellBelongsTo === undefined;
      }

      // - - - - - 2. decide either basic move or possible capturing action - - - - -
      const promotionRangeVariant = Math.abs(i - indexOfInitialCell);

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
    <Cell ref={drop} ui={ui}>
      {children}
      {!isOver && canDrop && <Overlay />}
      {isOver && canDrop && <Overlay isDarkerBackground/>}
    </Cell>
  )
}

export default CellComponent;
