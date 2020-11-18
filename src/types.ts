export type CellColor = "black" | "white";

export type CellConfig = {
  coordinates: {
    x: string;
    y: number;
  };
  shortand: string;
  color: CellColor;
};

export type BoardConfig = CellConfig[];

export type PlayersConfig = {
  whitePlayerCheckers: string[];
  blackPlayerCheckers: string[];
};

export type CellUIProps = {
  top: number;
  left: number;
  color: CellColor;
};
