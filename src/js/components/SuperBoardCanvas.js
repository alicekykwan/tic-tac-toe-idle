import React, { useEffect, useRef } from "react";
import Box from '@material-ui/core/Box';
import { COLOR_X, COLOR_O, COLOR_T, COLOR_WIN, COLOR_EMPTY_WIN, COLOR_BOARD, COLOR_GRID } from '../constants/colors';


function SuperBoardCanvas(props) {
  const boardColor = COLOR_BOARD;
  const gridColor = COLOR_GRID;
  const playerColor = [COLOR_X, COLOR_O, COLOR_T];
  let { appliedSBSettings, boards, superBoard, lastTickTime, width, height, padding } = props;
  let numSuperRows = appliedSBSettings.numRows;
  let numSuperCols = appliedSBSettings.numCols;
  let superCellWidth = (width-2*padding) / numSuperCols;
  let superCellHeight = (height-2*padding) / numSuperRows;
  let superGridThickness = superCellWidth / 12;
  let canvasRef = useRef(null);
  let drawnTick = useRef(null);
  let drawnSuperBoard = useRef(null);
  let drawnBoards = useRef(null);

  const drawSuperGrid = (ctx) => {
    ctx.beginPath();
    ctx.fillStyle = boardColor;
    ctx.fillRect(0, 0, width, height);
    ctx.stroke();
    ctx.beginPath();
    ctx.strokeStyle = gridColor;
    ctx.lineCap = 'round';
    ctx.lineWidth = superGridThickness;
    for (let i=1; i<numSuperRows; ++i) {
      ctx.moveTo(padding, padding + superCellHeight * i);
      ctx.lineTo(width - padding, padding + superCellHeight * i);
    }
    for (let j=1; j<numSuperCols; ++j) {
      ctx.moveTo(padding + superCellWidth * j, padding);
      ctx.lineTo(padding + superCellWidth * j, height - padding);
    }
    ctx.stroke();
  };

  const drawSuperWin = (ctx, winningGroup, color) => {
    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.lineJoin = 'round';
    ctx.lineWidth = superGridThickness;
    let first = true;
    let start = null;
    for (let cellIdx of winningGroup) {
      let rowIdx = Math.floor(cellIdx / numSuperCols);
      let colIdx = cellIdx % numSuperCols;
      let centerX = padding + superCellWidth * (colIdx + 0.5);
      let centerY = padding + superCellHeight * (rowIdx + 0.5);
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
  };

  const drawSubGrid = (ctx, numRows, numCols, startX, startY, cellWidth, cellHeight, thickness) => {
    ctx.beginPath();
    ctx.strokeStyle = gridColor;
    ctx.lineCap = 'round';
    ctx.lineWidth = thickness;
    for (let i=1; i<numRows; ++i) {
      ctx.moveTo(startX, startY + cellHeight * i);
      ctx.lineTo(startX + cellWidth * numCols, startY + cellHeight * i);
    }
    for (let j=1; j<numCols; ++j) {
      ctx.moveTo(startX + cellHeight * j, startY);
      ctx.lineTo(startX + cellHeight * j, startY + cellHeight * numRows);
    }
    ctx.stroke();
  };


  const drawPiece = (ctx, player, centerX, centerY, pieceWidth, pieceHeight, pieceThickness) => {
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

  const drawWin = (ctx, winningGroup, color, numCols, startX, startY, cellWidth, cellHeight, thickness) => {
    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.lineJoin = 'round';
    ctx.lineWidth = thickness;
    let first = true;
    let start = null;
    for (let cellIdx of winningGroup) {
      let rowIdx = Math.floor(cellIdx / numCols);
      let colIdx = cellIdx % numCols;
      let centerX = startX + cellWidth * (colIdx + 0.5);
      let centerY = startY + cellHeight * (rowIdx + 0.5);
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

  // negative lastDrawnMove means fully redraw
  const drawSubBoard = (ctx, board, lastDrawnMove, targetMove, startX, startY, width, height) => {
    if (lastDrawnMove === targetMove) {
      return;
    }
    let { numRows, numCols, numPlayers } = board.settings;
    let cellWidth = width / numCols;
    let cellHeight = height / numRows;
    let pieceWidth = 0.5 * cellWidth;
    let pieceHeight = 0.5 * cellHeight;
    let gridThickness = cellWidth / 8;
    let pieceThickness = cellWidth / 5;
    if (lastDrawnMove < 0) {
      lastDrawnMove = 0;
      ctx.beginPath();
      ctx.fillStyle = boardColor;
      ctx.fillRect(startX-gridThickness, startY-gridThickness, width+2*gridThickness, height+2*gridThickness);
      ctx.stroke();
      drawSubGrid(ctx, numRows, numCols, startX, startY, cellWidth, cellHeight, gridThickness);
      if (board.startState) {
        for (let [cellIdx, player] of board.startState.entries()) {
          if (player >= 0) {
            let rowIdx = Math.floor(cellIdx / numCols);
            let colIdx = cellIdx % numCols;
            let centerX = startX + cellWidth * (colIdx + 0.5);
            let centerY = startY + cellHeight * (rowIdx + 0.5);
            drawPiece(ctx, player, centerX, centerY, pieceWidth, pieceHeight, pieceThickness);
          }
        }
      }
    }
    for (let move=lastDrawnMove; move<targetMove; ++move) {
      let cellIdx = board.allMoves[move];
      let rowIdx = Math.floor(cellIdx / numCols);
      let colIdx = cellIdx % numCols;
      if (board.erase && board.erase[move]) {
        let x = startX + cellWidth * colIdx;
        let y = startY + cellHeight * rowIdx;
        ctx.beginPath();
        ctx.fillStyle = boardColor;
        ctx.fillRect(x+gridThickness, y+gridThickness, cellWidth-2*gridThickness, cellHeight-2*gridThickness);
        ctx.stroke();
      } else {
        let centerX = startX + cellWidth * (colIdx + 0.5);
        let centerY = startY + cellHeight * (rowIdx + 0.5);
        let player = (board.startPlayer + move) % numPlayers;
        drawPiece(ctx, player, centerX, centerY, pieceWidth, pieceHeight, pieceThickness);
      }
    }
    if (targetMove === board.movesUntilWin) {
      let color = board.emptyWin ? COLOR_EMPTY_WIN : COLOR_WIN;
      for (let winningGroup of board.winningGroups) {
        drawWin(ctx, winningGroup, color, numCols, startX, startY, cellWidth, cellHeight, gridThickness);
        ctx.beginPath();
        ctx.globalAlpha = 0.75;
        ctx.fillStyle = boardColor;
        ctx.fillRect(startX-gridThickness, startY-gridThickness, width+2*gridThickness, height+2*gridThickness);
        ctx.stroke();
        ctx.globalAlpha = 1.0;
        drawPiece(ctx, board.winner, startX+width/2, startY+height/2, 0.5 * width, 0.5 * height, width/5);
      }
    }
  };

  useEffect(()=>{
    if (drawnTick.current === lastTickTime) {
      return;
    }
    const canvasObj = canvasRef.current;
    const ctx = canvasObj.getContext('2d');
    if (drawnSuperBoard.current === null ||
        drawnSuperBoard.current.id !== superBoard.id ||
        drawnBoards.current.length !== boards.length) {
      drawSuperGrid(ctx);
      drawnBoards.current = null;
    }
    let boardWidth = superCellWidth - 2 * superGridThickness;
    let boardHeight = superCellWidth - 2 * superGridThickness;
    for (let i=0; i<boards.length; ++i) {
      let lastDrawnMove = -1;
      let rowIdx = Math.floor(i / numSuperCols);
      let colIdx = i % numSuperCols;
      let centerX = padding + superCellWidth * (colIdx + 0.5);
      let centerY = padding + superCellHeight * (rowIdx + 0.5);
      let startX = centerX - boardWidth / 2;
      let startY = centerY - boardHeight / 2;
      if (drawnBoards.current !== null && drawnBoards.current[i].id === boards[i].id) {
        // still the same board, so continue from last drawn move.
        lastDrawnMove = drawnBoards.current[i].numMovesMade;
      } else if (drawnBoards.current !== null && drawnBoards.current[i].id === boards[i].prevId) {
        // this board is the next chunk, so finish drawn board.
        drawSubBoard(
          ctx,
          drawnBoards.current[i], drawnBoards.current[i].numMovesMade, drawnBoards.current[i].allMoves.length,
          startX, startY, boardWidth, boardHeight);
        lastDrawnMove = 0;
      }
      drawSubBoard(
        ctx,
        boards[i], lastDrawnMove, boards[i].numMovesMade,
        startX, startY, boardWidth, boardHeight);
    }
    let color = superBoard.emptyWin ? COLOR_EMPTY_WIN : COLOR_WIN;
    for (let winningGroup of superBoard.winningGroups) {
      drawSuperWin(ctx, winningGroup, color);
    }
    drawnTick.current = lastTickTime;
    drawnSuperBoard.current = superBoard;
    drawnBoards.current = boards;
  });

  return <Box boxShadow={10} style={{width, height}} m={1}>
    <canvas ref={canvasRef} width={width} height={height}/>
  </Box>;
}

export default SuperBoardCanvas;
