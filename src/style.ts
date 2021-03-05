import styled from "styled-components";

import { boardSettings } from "./config";
import { RulerCell } from 'utils/style';

const { cellWidth, cellsNumber } = boardSettings;

export const AppHolder = styled.div`
  padding: 100px 75px;
`;

export const BoardHolder = styled.div`
  position: relative;
  width: ${cellWidth * cellsNumber}px;
  height: ${cellWidth * cellsNumber}px;
`;

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

export const UndoButtonContainer = styled.div`
  display: flex;
  margin-top: 75px;
`;
