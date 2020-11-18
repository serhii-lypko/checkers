import styled from "styled-components";

import { boardSettings } from "./config";

import { CellUIProps } from "./types";

const { cellWidth, cellsNumber } = boardSettings;

/* - - - - - - - - - - Common - - - - - - - - - - - - */

const FlexCenter = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const RulerCell = styled(FlexCenter)`
  position: absolute;
  width: ${cellWidth}px;
  height: ${cellWidth}px;
`;

/* - - - - - - - - - - - - - - - - - - - - - - - */

export const AppHolder = styled.div`
  padding: 100px;
`;

export const BoardHolder = styled.div`
  position: relative;
  width: ${cellWidth * cellsNumber}px;
  height: ${cellWidth * cellsNumber}px;
`;

export const Cell = styled(FlexCenter)<{ ui: CellUIProps }>`
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: ${(p) => p.ui.top}px;
  left: ${(p) => p.ui.left}px;
  width: ${cellWidth}px;
  height: ${cellWidth}px;
  background: ${(p) => p.ui.color};
  color: ${(p) => (p.ui.color === "white" ? "black" : "white")};
  outline: none;
  border: 1px solid black;
`;

export const Checker = styled.div<{ isLightColor: boolean }>`
  width: ${cellWidth - 15}px;
  height: ${cellWidth - 15}px;
  background: ${(p) => (p.isLightColor ? "white" : "#333")};
  border-radius: 50%;
`;

/* - - - - - - - - - - - - - - - - - - - */

export const YRulerContainer = styled.div`
  display: flex;
  flex-direction: column;
  position: absolute;
  left: ${-cellWidth}px;
  width: ${cellWidth}px;
  height: ${cellsNumber * cellWidth}px;
`;

export const XRulerContainer = styled.div`
  display: flex;
  position: absolute;
  left: 0;
  bottom: -${cellWidth}px;
  width: ${cellsNumber * cellWidth}px;
  height: ${cellWidth}px;
`;

export const YRulerCell = styled(RulerCell)<{ top: number }>`
  top: ${(p) => p.top}px;
  left: 0;
`;

export const XRulerCell = styled(RulerCell)<{ left: number }>`
  left: ${(p) => p.left}px;
  bottom: 0;
`;

/* - - - - - - - - - - - - - - - - - - - */

export const ControlsHolder = styled.div`
  display: flex;
  align-items: center;
  position: relative;
  margin-top: 100px;

  button {
    &:first-child {
      margin-right: 30px;
    }

    width: 70px;
    margin-right: 10px;
  }
`;
