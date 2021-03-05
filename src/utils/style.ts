import styled from "styled-components";
import { boardSettings } from "config";

const { cellWidth } = boardSettings;

export const FlexCenter = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const RulerCell = styled(FlexCenter)`
  position: absolute;
  width: ${cellWidth}px;
  height: ${cellWidth}px;
`;
