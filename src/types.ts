export type Player = "light" | "dark";

export type CellParams = {
  x: string;
  y: number;
  id: string;
  color: Player;
};

export type CellState = {
  isKing: boolean;
  belongsTo?: Player;
}

export type GameState = {
  [key: string]: CellState
}

export type CellUI = {
  top: number;
  left: number;
  color: string;
};

export type OnDropPayload = {
  type: string;
  fromCellId: string;
  fromPlayer: Player;
}
