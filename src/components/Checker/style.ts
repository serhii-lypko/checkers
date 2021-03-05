import styled from "styled-components";
import { boardSettings } from "config";
const { cellWidth } = boardSettings;

export const Checker = styled.div<{ isLightColor: boolean; isKing: boolean; isDragging: boolean }>`
  position: relative;
  z-index: 2;
  width: ${cellWidth - 20}px;
  height: ${cellWidth - 20}px;
  opacity: ${p => p.isDragging ? 0.6 : 1};
  background: ${(p) => (p.isLightColor ? "white" : "#333")};
  border-radius: 50%;
  overflow: hidden;
  cursor: grab;
  
  &:after {
    content: "♕";
    position: absolute;
    top: -7px;
    left: 10px;
    width: 10px;
    height: 10px;
    font-size: 49px;
    visibility: ${p => p.isKing ? "visible" : "hidden"};
    color: ${(p) => (p.isLightColor ? "#333" : "white")};
  }
`;
