import styled from "styled-components";
import { CellUI } from "types";

import { boardSettings } from "config";
import { FlexCenter } from 'utils/style';

const { cellWidth } = boardSettings;

export const Cell = styled(FlexCenter)<{ ui: CellUI }>`
  position: absolute;
  top: ${(p) => p.ui.top}px;
  left: ${(p) => p.ui.left}px;
  width: ${cellWidth}px;
  height: ${cellWidth}px;
  background: ${(p) => p.ui.color};
  outline: none;
  border: 1px solid black;
`;

export const Overlay = styled.div<{ isDarkerBackground?: boolean }>`
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1;
  width: 100%;
  height: 100%;
  opacity: 0.25;
  background: ${p => p.isDarkerBackground ? "black" : "yellow"};
`;
