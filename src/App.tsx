import React, { useState, useCallback } from "react";

import { fromEvent } from "rxjs";
import { range, reverse, flatten } from "lodash";

import { CellConfig, PlayersState, ActivePromotion, PromotionType } from "./types";

import { boardSettings, players } from "./config";
import {
  boardConfig,
  initialPlayersStateConfig,
  createDiagonals,
  findElementBetween,
} from "./utils";

import {
  AppHolder,
  BoardHolder,
  Cell,
  Checker,
  YRulerContainer,
  XRulerContainer,
  YRulerCell,
  XRulerCell,
  ControlsHolder,
} from "./style";

/* - - - - - - - - - - - - - - - - - - - */
/* - - - - - - - - - - - - - - - - - - - */

// TODO: --> --> make it work, make it right, make it fast <-- <--

/* - - - - - - - - - - - - - - - - - - - */
/* - - - - - - - - - - - - - - - - - - - */

// TODO: implement with reactive actions

// TODO.1: memoization of components (Cell)
// TODO.2 (epic): implement sequence of moves between opponents (including capturing chaining)
// TODO.3: back & forward actions

/* - - - - - - - - - - - - - - - - - - - */

const diagonals = createDiagonals();

// console.log("diagonals: ", diagonals);

function App() {
  const [playersState, setPlayersState] = useState<PlayersState>(initialPlayersStateConfig);
  const [activePromotion, setActivePromotion] = useState<ActivePromotion | undefined>(undefined);

  // console.log("playersState: ", playersState);

  // console.log("playersState: ", playersState);

  // console.log("activePromotion: ", activePromotion);

  /* - - - - - - - - - - - - - - - - - - - */

  const definePromotionType = useCallback(
    (initialCell: string, destinationCell: string): PromotionType => {
      const allowedDiagonals = diagonals.filter((diagonal) => diagonal.includes(initialCell));
      const allowedCoordinates = flatten(allowedDiagonals);
      const diagonalPromotionIsCorrect = allowedCoordinates.includes(destinationCell);

      if (!diagonalPromotionIsCorrect) return { promotionType: "incorrect" };

      /* - - - - - - - - - - - - - - - - - - - */

      const chosenPromotionDiagonal = allowedDiagonals.find((diagonal) =>
        diagonal.includes(destinationCell),
      );

      const initialPositionIndex = chosenPromotionDiagonal?.indexOf(initialCell) as number;
      const destinationPositionIndex = chosenPromotionDiagonal?.indexOf(destinationCell) as number;

      const moveRangeAttempt = Math.abs(initialPositionIndex - destinationPositionIndex);

      if (moveRangeAttempt === 1) return { promotionType: "basicMove" };

      /* - - - - - - - - - - - - - - - - - - - */

      const opponent = players.filter((player) => player !== activePromotion?.player)[0];
      const opponentCheckers = playersState[opponent];

      const opponentCheckersOnPromotionDiagonal = opponentCheckers.filter((checker) => {
        return chosenPromotionDiagonal?.includes(checker);
      });

      if (moveRangeAttempt === 2) {
        const capturingChecker = findElementBetween<string>(
          chosenPromotionDiagonal as string[],
          initialCell,
          destinationCell,
        );

        const isCapturing = opponentCheckersOnPromotionDiagonal.includes(capturingChecker);

        if (isCapturing) return { promotionType: "capturing", capturingChecker, opponent };
      }

      // in case if moveRangeAttempt is incorrect
      return { promotionType: "incorrect" };
    },
    [activePromotion, playersState],
  );

  /* - - - - - - - - - - - - - - - - - - - */

  const makeCapturing = useCallback(
    (destinationCell: string, capturingChecker?: string, opponent?: string) => {
      if (!capturingChecker || !opponent || !activePromotion?.player) return;

      const updatedPlayerState = playersState[activePromotion?.player].map((checker) => {
        if (checker === activePromotion?.cellId) {
          return destinationCell;
        }

        return checker;
      });

      const updatedOpponentState = playersState[opponent].filter((checker) => {
        return checker !== capturingChecker;
      });

      const updatedPlayersState = {
        [activePromotion.player]: updatedPlayerState,
        [opponent]: updatedOpponentState,
      };

      setPlayersState(updatedPlayersState as PlayersState);
      setActivePromotion(undefined);
    },
    [playersState, activePromotion],
  );

  const makeBasicMove = useCallback(
    (destinationCell: string) => {
      const activePlayerKey = activePromotion?.player as string;
      const playerState = playersState[activePlayerKey];

      const updatedPlayerState = playerState.map((checker) => {
        if (checker === activePromotion?.cellId) {
          return destinationCell;
        }

        return checker;
      });

      setPlayersState({
        ...playersState,
        [activePlayerKey]: updatedPlayerState,
      });
      setActivePromotion(undefined);
    },
    [activePromotion, playersState],
  );

  /* - - - - - - - - - - - - - - - - - - - */

  const handleCellClick = useCallback(
    ({ id: cellIdFromClick }: CellConfig) => {
      const { white: whitePlayerCheckers, black: blackPlayerCheckers } = playersState;

      if (cellIdFromClick === activePromotion?.cellId) {
        setActivePromotion(undefined);
        return;
      }

      const cellIsTaken =
        whitePlayerCheckers.includes(cellIdFromClick) ||
        blackPlayerCheckers.includes(cellIdFromClick);

      if (activePromotion) {
        if (cellIsTaken) return;

        const { promotionType, capturingChecker, opponent } = definePromotionType(
          activePromotion.cellId,
          cellIdFromClick,
        );

        switch (promotionType) {
          case "basicMove":
            makeBasicMove(cellIdFromClick);
            return;
          case "capturing":
            makeCapturing(cellIdFromClick, capturingChecker, opponent);
            return;
          case "incorrect":
            return;
        }
      }

      if (cellIsTaken) {
        const belongsToWhitePlayer = whitePlayerCheckers.includes(cellIdFromClick);

        setActivePromotion({
          player: belongsToWhitePlayer ? "white" : "black",
          cellId: cellIdFromClick,
        });
        return;
      }
    },
    [activePromotion, playersState, definePromotionType, makeBasicMove, makeCapturing],
  );

  const handleResetAction = useCallback(() => {
    setPlayersState(initialPlayersStateConfig);
    setActivePromotion(undefined);
  }, []);

  /* - - - - - - - - - Rulers - - - - - - - - - - */

  const renderYRuler = () => {
    const { cellsNumber, cellWidth } = boardSettings;

    return (
      <YRulerContainer className="y-ruler-container">
        {reverse(range(0, cellsNumber)).map((key, i) => {
          return (
            <YRulerCell key={key} top={key * cellWidth} className="y-ruler-cell">
              {i + 1}
            </YRulerCell>
          );
        })}
      </YRulerContainer>
    );
  };

  const renderXRuler = () => {
    const { alphabet, cellWidth } = boardSettings;

    return (
      <XRulerContainer className="x-ruler-container">
        {alphabet.map((char) => {
          return (
            <XRulerCell
              key={char}
              left={alphabet.indexOf(char) * cellWidth}
              className="x-ruler-cell"
            >
              {char}
            </XRulerCell>
          );
        })}
      </XRulerContainer>
    );
  };

  /* - - - - - - - - - - - - - - - - - - - */

  const renderCells = () => {
    if (!playersState) return null;

    return boardConfig.map((cell) => {
      const { id, color, coordinates } = cell;

      const yFactor = (boardSettings.cellsNumber - coordinates.y) * boardSettings.cellWidth;
      const xFactor = boardSettings.alphabet.indexOf(coordinates.x) * boardSettings.cellWidth;

      const cellUI = {
        top: yFactor,
        left: xFactor,
        color,
      };

      const { white: whitePlayerCheckers, black: blackPlayerCheckers } = playersState;

      const cellHasWhiteChecker = whitePlayerCheckers.includes(id);
      const cellHasBlackChecker = blackPlayerCheckers.includes(id);

      return (
        <Cell key={id} ui={cellUI} onClick={() => handleCellClick(cell)} className="cell">
          {(cellHasWhiteChecker || cellHasBlackChecker) && (
            <Checker
              isLightColor={cellHasWhiteChecker}
              isInPromotion={activePromotion && activePromotion.cellId === id}
            />
          )}
        </Cell>
      );
    });
  };

  /* - - - - - - - - - - - - - - - - - - - - - - */
  /* - - - - - - - - - - - - - - - - - - - - - - */

  return (
    <AppHolder>
      <BoardHolder>
        {renderYRuler()}
        {renderXRuler()}

        {renderCells()}
      </BoardHolder>

      <ControlsHolder className="controls-holder">
        <button onClick={handleResetAction}>Reset</button>
        <button>Back</button>
        <button>Forward</button>
      </ControlsHolder>
    </AppHolder>
  );
}

export default App;
