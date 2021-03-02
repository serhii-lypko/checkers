export type Player = "light" | "dark";

export type CellParams = {
  x: string;
  y: number;
  id: string;
  color: Player;
};

export type CellState = {
  id: string;
  owner: Player | undefined;
}

export type OnDropPayload = {
  type: string;
  fromCellId: string;
  fromPlayer: Player;
}

export type GameState = {
  [key: string]: {
    isKing: boolean;
    belongsTo?: Player;
  }
}

/* - - - - - - - - - - - - - - - - - - - */
/* - - - - - - - - - - - - - - - - - - - */

// FIXME: remove outdated types?

// outdated
export type CellConfig = {
  x: string;
  y: number;
  id: string;
  color: Player;
};

export type BoardConfig = CellConfig[];

export type PlayerChecker = {
  id: string;
  kind: "default" | "king";
};

export type PlayersState = {
  white: PlayerChecker[];
  black: PlayerChecker[];
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
