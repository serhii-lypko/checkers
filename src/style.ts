import styled from "styled-components";

import { boardSettings } from "./config";

import { CellUIProps } from "./types";

const { cellWidth, cellsNumber, colors } = boardSettings;

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
  padding: 100px 75px;
`;

export const BoardHolder = styled.div`
  position: relative;
  width: ${cellWidth * cellsNumber}px;
  height: ${cellWidth * cellsNumber}px;
`;

export const Cell = styled(FlexCenter)<{ ui: CellUIProps }>`
  position: absolute;
  top: ${(p) => p.ui.top}px;
  left: ${(p) => p.ui.left}px;
  width: ${cellWidth}px;
  height: ${cellWidth}px;
  background: ${(p) => p.ui.color};
  outline: none;
  border: 1px solid black;
`;

export const Overlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1;
  width: 100%;
  height: 100%;
  opacity: 0.25;
  background: yellow;
`;

export const Checker = styled.div<{ isLightColor: boolean;}>`
  position: relative;
  z-index: 2;
  width: ${cellWidth - 20}px;
  height: ${cellWidth - 20}px;
  background: ${(p) => (p.isLightColor ? "white" : "#333")};
  border-radius: 50%;
  overflow: hidden;
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

export const LastMoveByHolder = styled.div`
  display: flex;
  align-items: center;
  margin-top: 75px;
`;

export const MockCell = styled(FlexCenter)`
  width: ${cellWidth}px;
  height: ${cellWidth}px;
  margin-right: 15px;
  background: ${colors.light};
  border: 1px solid black;
`;
