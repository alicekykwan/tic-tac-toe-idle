import React, { useEffect, useRef } from "react";
import Box from '@material-ui/core/Box';
import { COLOR_X, COLOR_O, COLOR_T, COLOR_WIN, COLOR_EMPTY_WIN, COLOR_BOARD, COLOR_GRID } from '../constants/colors';


function BoardCanvas(props) {
  const boardColor = COLOR_BOARD;
  const gridColor = COLOR_GRID;
  const playerColor = [COLOR_X, COLOR_O, COLOR_T];
  let { board, lastTickTime, width, height, padding } = props;
  let { numRows, numCols, numPlayers } = board.settings;
  let { allMoves } = board;
  let cellWidth = (width-2*padding) / numCols;
  let cellHeight = (height-2*padding) / numRows;
  let gridThickness = cellWidth / 8;
  let pieceWidth = 0.5 * cellWidth;
  let pieceHeight = 0.5 * cellHeight;
  let pieceThickness = cellWidth / 5;
  let canvasRef = useRef(null);
  let drawnTick = useRef(null);
  let drawnBoard = useRef(null);

  const drawGrid = (ctx) => {
    ctx.beginPath();
    ctx.fillStyle = boardColor;
    ctx.fillRect(0, 0, width, height);
    ctx.stroke();
    ctx.beginPath();
    ctx.strokeStyle = gridColor;
    ctx.lineCap = 'round';
    ctx.lineWidth = gridThickness;
    for (let i=1; i<numRows; ++i) {
      ctx.moveTo(padding, padding + cellHeight * i);
      ctx.lineTo(width - padding, padding + cellHeight * i);
    }
    for (let j=1; j<numCols; ++j) {
      ctx.moveTo(padding + cellWidth * j, padding);
      ctx.lineTo(padding + cellWidth * j, height - padding);
    }
    ctx.stroke();
  };

  const drawPiece = (ctx, cellIdx, player) => {
    let rowIdx = Math.floor(cellIdx / numCols);
    let colIdx = cellIdx % numCols;
    let centerX = padding + cellWidth * (colIdx + 0.5);
    let centerY = padding + cellHeight * (rowIdx + 0.5);
    switch (player) {
      case 0:  // X
        ctx.beginPath();
        ctx.strokeStyle = playerColor[player];
        ctx.lineCap = 'round';
        ctx.lineWidth = pieceThickness;
        ctx.moveTo(centerX-pieceWidth/2, centerY-pieceHeight/2);
        ctx.lineTo(centerX+pieceWidth/2, centerY+pieceHeight/2);
        ctx.moveTo(centerX+pieceWidth/2, centerY-pieceHeight/2);
        ctx.lineTo(centerX-pieceWidth/2, centerY+pieceHeight/2);
        ctx.stroke();
        break;
      case 1:  // O
        ctx.beginPath();
        ctx.strokeStyle = playerColor[player];
        ctx.lineWidth = pieceThickness;
        ctx.ellipse(centerX, centerY, pieceWidth/2, pieceHeight/2, 0, 0, 2*Math.PI);
        ctx.stroke();
        break;
      case 2:  // T
        ctx.beginPath();
        ctx.strokeStyle = playerColor[player];
        ctx.lineJoin = 'round';
        ctx.lineWidth = pieceThickness;
        ctx.moveTo(centerX, centerY-pieceHeight/2);
        ctx.lineTo(centerX+pieceHeight/2, centerY+pieceHeight/2);
        ctx.lineTo(centerX-pieceHeight/2, centerY+pieceHeight/2);
        ctx.lineTo(centerX, centerY-pieceHeight/2);
        ctx.stroke();
        break;
      default:
    }
  };

  const erasePiece = (ctx, cellIdx) => {
    let rowIdx = Math.floor(cellIdx / numCols);
    let colIdx = cellIdx % numCols;
    let startX = padding + cellWidth * colIdx;
    let startY = padding + cellHeight * rowIdx;
    ctx.beginPath();
    ctx.fillStyle = boardColor;
    ctx.fillRect(startX+gridThickness, startY+gridThickness, cellWidth-2*gridThickness, cellHeight-2*gridThickness);
    ctx.stroke();
  };

  const drawWin = (ctx, winningGroup, color) => {
    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.lineJoin = 'round';
    ctx.lineWidth = gridThickness;
    let first = true;
    let start = null;
    for (let cellIdx of winningGroup) {
      let rowIdx = Math.floor(cellIdx / numCols);
      let colIdx = cellIdx % numCols;
      let centerX = padding + cellWidth * (colIdx + 0.5);
      let centerY = padding + cellHeight * (rowIdx + 0.5);
      if (first) {
        first = false;
        start = [centerX, centerY];
        ctx.moveTo(centerX, centerY);
      } else {
        ctx.lineTo(centerX, centerY);
      }
    }
    ctx.lineTo(start[0], start[1]);
    ctx.stroke();
  }

  useEffect(()=>{
    if (drawnTick.current === lastTickTime) {
      return;
    }
    const canvasObj = canvasRef.current;
    const ctx = canvasObj.getContext('2d');
    let lastPieceDrawn = 0; // number of valid pieces already drawn
    if (drawnBoard.current && board.prevId === drawnBoard.current.id) {
      // New board is the next chunk of drawn board so drawing remaining moves
      // should be faster than redrawing.
      let { numMovesMade, allMoves, erase, startPlayer } = drawnBoard.current;
      for (let move=numMovesMade; move<allMoves.length; ++move) {
        if (erase && erase[move]) {
          erasePiece(ctx, allMoves[move]);
        } else {
          drawPiece(
            ctx,
            allMoves[move],
            (startPlayer+move) % numPlayers);
        }
      }
      lastPieceDrawn = 0;
    } else if (drawnBoard.current === null ||
        board.numMovesMade < drawnBoard.current.numMovesMade ||
        board.id !== drawnBoard.current.id) {
      // New board, wipe and redraw.
      drawGrid(ctx);
      if (board.startState) {
        for (let [cell, player] of board.startState.entries()) {
          if (player >= 0) {
            drawPiece(ctx, cell, player);
          }
        }
      }
      lastPieceDrawn = 0;
    } else {
      // Same board, continue from last drawn piece.
      lastPieceDrawn = drawnBoard.current.numMovesMade;
    }
    for (let move=lastPieceDrawn; move<board.numMovesMade; ++move) {
      if (board.erase && board.erase[move]) {
        erasePiece(ctx, allMoves[move]);
      } else {
        drawPiece(
          ctx,
          allMoves[move],
          (board.startPlayer+move) % numPlayers);
      }
    }
    if (board.numMovesMade === board.movesUntilWin) {
      let color = board.emptyWin ? COLOR_EMPTY_WIN : COLOR_WIN;
      for (let winningGroup of board.winningGroups) {
        drawWin(ctx, winningGroup, color);
      }
    }
    drawnTick.current = lastTickTime;
    drawnBoard.current = board;
  });

  return <Box boxShadow={10} style={{width, height}} m={1}>
    <canvas ref={canvasRef} width={width} height={height}/>
  </Box>;
}

export default BoardCanvas;
