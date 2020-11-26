export type Player = "black" | "white";

export type CellConfig = {
  coordinates: {
    x: string;
    y: number;
  };
  id: string;
  color: Player;
};

export type BoardConfig = CellConfig[];

export type PlayersState = {
  white: string[];
  black: string[];
};

export type CellUIProps = {
  top: number;
  left: number;
  color: Player;
};

export type ActivePromotion = {
  player: Player;
  cellId: string;
};

export type PromotionType = {
  promotionType: "basicMove" | "capturing" | "incorrect";
  opponent?: string;
  capturingChecker?: string;
};
