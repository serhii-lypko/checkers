import React, { useState } from "react";

import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

import {
  range,
  reverse,
  // flatten
} from "lodash";

import { CellParams, Player, CellState, OnDropPayload } from './types';

// import { CellConfig, PlayersState, ActivePromotion, PromotionType, Player } from "./types";

import {
  boardSettings,
  // players
} from "./config";
import {
  createBoardSetup,
  createInitialGameState,
  // createDiagonals,
  // getPlayersCheckersIds,
  // findElementBetween,
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
  // ControlsHolder,
  // LastMoveByHolder,
  // MockCell,
} from "./style";

// TODO: main -> implement typescript with NO IMPLICIT ANY


/* - - - - - - - - - - - - - - - - - - - */
/*
*
*
* */
/* - - - - - - - - - - - - - - - - - - - */


type CheckerComponentProps = any; // FIXME
function CheckerComponent({ cellState }: CheckerComponentProps) {
  const [{ isDragging }, drag] = useDrag(() => ({
    item: { type: "checker", fromId: cellState.id, fromPlayer: cellState.owner },
    collect: (monitor) => ({
      isDragging: monitor.isDragging()
    })
  }));

  if (!cellState || !cellState.owner) return <div />;

  return (
    <Checker
      ref={drag}
      isLightColor={cellState.owner === "light"}
      style={{ opacity: isDragging ? 0.5 : 1, }}
    />
  )
}

type CellComponentProps = any; // FIXME
function CellComponent({ id, ui, gameState, onDrop, children }: CellComponentProps) {
  const [{ isOver, canDrop }, drop] = useDrop(
    () => ({
      accept: "checker",
      drop: ({ fromId, fromPlayer }: OnDropPayload) => onDrop(fromId, fromPlayer, /*toId: */id),
      canDrop: () => {
        // console.log('to id: ', id);
        return true;
      },
      collect: (monitor) => ({
        isOver: monitor.isOver(),
        canDrop: monitor.canDrop()
      })
    }),
    [id, onDrop, gameState]
  );

  return (
    <Cell ref={drop} ui={ui} className="cell">
      {children}

      {!isOver && canDrop && <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          height: '100%',
          width: '100%',
          zIndex: 1,
          opacity: 0.15,
          backgroundColor: "yellow",
        }} />}
    </Cell>
  )
}

const boardSetup = createBoardSetup();
const initialGameState = createInitialGameState(boardSetup);

// const diagonals = createDiagonals();

function App() {
  const [gameState, commitGameStateChange] = useState<CellState[]>(initialGameState);

  /* - - - - - - - - - - - - - - - - - - - */

  // const definePromotionType = (initialCell, destinationCell) => {
  //   const allowedDiagonals = diagonals.filter((diagonal) => diagonal.includes(initialCell));
  //   const allowedCoordinates = flatten(allowedDiagonals);
  //   const diagonalPromotionIsCorrect = allowedCoordinates.includes(destinationCell);
  //
  //   if (!diagonalPromotionIsCorrect) return { promotionType: "incorrect" };
  //
  //   /* - - - - - - - - - - - - - - - - - - - */
  //
  //   const chosenPromotionDiagonal = allowedDiagonals.find((diagonal) =>
  //     diagonal.includes(destinationCell),
  //   );
  //
  //   const initialPositionIndex = chosenPromotionDiagonal?.indexOf(initialCell);
  //   const destinationPositionIndex = chosenPromotionDiagonal?.indexOf(destinationCell);
  //
  //   const moveRangeAttempt = Math.abs(initialPositionIndex - destinationPositionIndex);
  //
  //   if (moveRangeAttempt === 1) return { promotionType: "basicMove" };
  //
  //   /* - - - - - - - - - - - - - - - - - - - */
  //
  //   const opponent = players.filter((player) => player !== activePromotion?.player)[0];
  //   const opponentCheckers = playersState[opponent];
  //
  //   const opponentCheckersOnPromotionDiagonal = opponentCheckers.filter((checker) => {
  //     return chosenPromotionDiagonal?.includes(checker.id);
  //   });
  //
  //   if (moveRangeAttempt === 2) {
  //     const capturingChecker = findElementBetween(
  //       chosenPromotionDiagonal,
  //       initialCell,
  //       destinationCell,
  //     );
  //
  //     const isCapturing = opponentCheckersOnPromotionDiagonal
  //       .map((checker) => checker.id)
  //       .includes(capturingChecker);
  //
  //     if (isCapturing) return { promotionType: "capturing", capturingChecker, opponent };
  //   }
  //
  //   // in case if moveRangeAttempt is incorrect
  //   return { promotionType: "incorrect" };
  // };

  // const makeCapturing = (destinationCell, capturingChecker, opponent) => {
  //   if (!capturingChecker || !opponent || !activePromotion?.player) return;
  //
  //   const updatedPlayerState = playersState[activePromotion?.player].map((checker) => {
  //     if (checker.id === activePromotion?.cellId) {
  //       return {
  //         ...checker,
  //         id: destinationCell,
  //       };
  //     }
  //
  //     return checker;
  //   });
  //
  //   const updatedOpponentState = playersState[opponent].filter((checker) => {
  //     return checker.id !== capturingChecker;
  //   });
  //
  //   const updatedPlayersState = {
  //     [activePromotion.player]: updatedPlayerState,
  //     [opponent]: updatedOpponentState,
  //   };
  //
  //   setPlayersState(updatedPlayersState);
  //   setActivePromotion(undefined);
  // };

  // const makeBasicMove = (destinationCell) => {
  //   const activePlayerKey = activePromotion.player;
  //   const playerState = playersState[activePlayerKey];
  //
  //   const updatedPlayerState = playerState.map((checker) => {
  //     if (checker.id === activePromotion?.cellId) {
  //       return {
  //         ...checker,
  //         id: destinationCell,
  //       };
  //     }
  //
  //     return checker;
  //   });
  //
  //   setPlayersState({
  //     ...playersState,
  //     [activePlayerKey]: updatedPlayerState,
  //   });
  //   setActivePromotion(undefined);
  // };

  // const handleCellClick = ({ id: cellIdFromClick }) => {
  //   const { whitePlayerCheckers, blackPlayerCheckers } = getPlayersCheckersIds(playersState);
  //
  //   if (cellIdFromClick === activePromotion?.cellId) {
  //     setActivePromotion(undefined);
  //     return;
  //   }
  //
  //   const cellIsTaken =
  //     whitePlayerCheckers.includes(cellIdFromClick) ||
  //     blackPlayerCheckers.includes(cellIdFromClick);
  //
  //   if (activePromotion) {
  //     if (cellIsTaken) return;
  //
  //     const { promotionType, capturingChecker, opponent } = definePromotionType(
  //       activePromotion.cellId,
  //       cellIdFromClick,
  //     );
  //
  //     if (promotionType !== "incorrect") {
  //       setLastMoveBy(activePromotion.player);
  //     }
  //
  //     switch (promotionType) {
  //       case "basicMove":
  //         makeBasicMove(cellIdFromClick);
  //         return;
  //       case "capturing":
  //         makeCapturing(cellIdFromClick, capturingChecker, opponent);
  //
  //         return;
  //       case "incorrect":
  //         return;
  //     }
  //   }
  //
  //   if (cellIsTaken) {
  //     const belongsToWhitePlayer = whitePlayerCheckers.includes(cellIdFromClick);
  //
  //     setActivePromotion({
  //       player: belongsToWhitePlayer ? "white" : "black",
  //       cellId: cellIdFromClick,
  //     });
  //     return;
  //   }
  // };

  // const handleResetAction = () => {
  //   setPlayersState(initialPlayersStateConfig);
  //   setActivePromotion(undefined);
  // };

  const handleOnDrop = (fromId: string, fromPlayer: Player, toId: string) => {
    const updatedState = gameState.map(cellState => {
      if (cellState.id === toId) {
        return {
          ...cellState,
          owner: fromPlayer
        }
      }

      if (cellState.id === fromId) {
        return {
          ...cellState,
          owner: undefined
        }
      }

      return cellState;
    });

    commitGameStateChange(updatedState);
  };

  /* - - - - - - - - - Renderers - - - - - - - - - - */

  const renderYRuler = () => {
    const { cellsNumber, cellWidth } = boardSettings;

    return (
      <YRulerContainer className="y-ruler-container">
        {reverse(range(0, cellsNumber)).map((key: number, i: number) => {
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

  const renderCells = () => {
    return boardSetup.map((cell) => {
      const { x, y, id, color } = cell;

      const cellUI = {
        top: (boardSettings.cellsNumber - y) * boardSettings.cellWidth,
        left: boardSettings.alphabet.indexOf(x) * boardSettings.cellWidth,
        color: boardSettings.colors[color],
      };

      const cellState = gameState.find(gameStateCell => gameStateCell.id === id);

      return (
        <CellComponent
          id={id}
          key={id}
          ui={cellUI}
          gameState={gameState}
          onDrop={handleOnDrop}
        >
          <CheckerComponent cellState={cellState} />
        </CellComponent>
      );
    });
  };

  /* - - - - - - - - - - - - - - - - - - - - - - */

  return (
    <AppHolder>
      <DndProvider backend={HTML5Backend}>
        <BoardHolder>
          {renderYRuler()}
          {renderXRuler()}

          {renderCells()}
        </BoardHolder>
      </DndProvider>

      {/*<LastMoveByHolder className="last-move-by">*/}
      {/*  <MockCell className="mock-cell">*/}
      {/*    {lastMoveBy && <Checker isLightColor={lastMoveBy === "white"} isInPromotion={false} />}*/}
      {/*  </MockCell>*/}
      {/*  <span>last step from</span>*/}
      {/*</LastMoveByHolder>*/}

      {/*<ControlsHolder className="controls-holder">*/}
      {/*  <button onClick={handleResetAction}>Reset</button>*/}
      {/*  <button>Back</button>*/}
      {/*  <button>Forward</button>*/}
      {/*</ControlsHolder>*/}
    </AppHolder>
  );
}

export default App;
