import React from "react";
import { useDrag } from "react-dnd";

import { CellState } from "types";

import { Checker } from "./style";

/* - - - - - - - - - - - - - - - - - - - */

type CheckerComponentProps = {
  cellId: string;
  cellState: CellState;
}

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
      isDragging={isDragging}
    />
  )
}

export default CheckerComponent;
