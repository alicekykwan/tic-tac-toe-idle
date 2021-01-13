import React, { useEffect, useRef, useState } from "react";
import Box from '@material-ui/core/Box';
import { COLOR_X, COLOR_O, COLOR_WIN, COLOR_BOARD, COLOR_GRID } from '../constants/colors'


function SuperBoardCanvas(props) {
  const boardColor = COLOR_BOARD;
  const gridColor = COLOR_GRID;
  const playerColor = [COLOR_X, COLOR_O];
  const winColor = COLOR_WIN;
  let { appliedSBSettings, boards, superBoard, lastTickTime, width, height, padding } = props;
  let numSuperRows = appliedSBSettings.numRows;
  let numSuperCols = appliedSBSettings.numCols;
  let superCellWidth = (width-2*padding) / numSuperCols;
  let superCellHeight = (height-2*padding) / numSuperRows;
  let superGridThickness = superCellWidth / 12;
  let canvasRef = useRef(null);
  let [ drawnTick, setDrawnTick ] = useState(null);
  let [ drawnBoards, setDrawnBoards ] = useState(null);

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

  const drawSuperWin = (ctx, winningGroup) => {
    ctx.beginPath();
    ctx.strokeStyle = winColor;
    ctx.lineWidth = superGridThickness;
    let first = true;
    for (let cellIdx of winningGroup) {
      let rowIdx = Math.floor(cellIdx / numSuperCols);
      let colIdx = cellIdx % numSuperCols;
      let centerX = padding + superCellWidth * (colIdx + 0.5);
      let centerY = padding + superCellHeight * (rowIdx + 0.5);
      if (first) {
        first = false;
        ctx.moveTo(centerX, centerY);
      } else {
        ctx.lineTo(centerX, centerY);
      }
    }
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
      default:
    }
  };

  const drawWin = (ctx, winningGroup, numCols, startX, startY, cellWidth, cellHeight, thickness) => {
    ctx.beginPath();
    ctx.strokeStyle = winColor;
    ctx.lineWidth = thickness;
    let first = true;
    for (let cellIdx of winningGroup) {
      let rowIdx = Math.floor(cellIdx / numCols);
      let colIdx = cellIdx % numCols;
      let centerX = startX + cellWidth * (colIdx + 0.5);
      let centerY = startY + cellHeight * (rowIdx + 0.5);
      if (first) {
        first = false;
        ctx.moveTo(centerX, centerY);
      } else {
        ctx.lineTo(centerX, centerY);
      }
    }
    ctx.stroke();
  }

  const drawSubBoard = (ctx, board, startX, startY, width, height) => {
    let { numRows, numCols, numPlayers } = board;
    let cellWidth = width / numCols;
    let cellHeight = height / numRows;
    let pieceWidth = 0.5 * cellWidth;
    let pieceHeight = 0.5 * cellHeight;
    let gridThickness = cellWidth / 8;
    let pieceThickness = cellWidth / 5;
    drawSubGrid(ctx, numRows, numCols, startX, startY, cellWidth, cellHeight, gridThickness);
    for (let move=0; move<board.numMovesMade; ++move) {
      let cellIdx = board.allMoves[move];
      let rowIdx = Math.floor(cellIdx / numCols);
      let colIdx = cellIdx % numCols;
      let centerX = startX + cellWidth * (colIdx + 0.5);
      let centerY = startY + cellHeight * (rowIdx + 0.5);
      drawPiece(ctx, move % numPlayers, centerX, centerY, pieceWidth, pieceHeight, pieceThickness);
    }
    if (board.numMovesMade === board.movesUntilWin) {
      for (let winningGroup of board.winningGroups) {
        drawWin(ctx, winningGroup, numCols, startX, startY, cellWidth, cellHeight, gridThickness);
      }
    }
  };

  useEffect(()=>{
    if (drawnTick === lastTickTime) {
      return;
    }
    const canvasObj = canvasRef.current;
    const ctx = canvasObj.getContext('2d');
    // TODO: improve with incremental drawing.
    drawSuperGrid(ctx);
    let boardWidth = superCellWidth - 2 * superGridThickness;
    let boardHeight = superCellWidth - 2 * superGridThickness;
    for (let i=0; i<boards.length; ++i) {
      let rowIdx = Math.floor(i / numSuperCols);
      let colIdx = i % numSuperCols;
      let centerX = padding + superCellWidth * (colIdx + 0.5);
      let centerY = padding + superCellHeight * (rowIdx + 0.5);
      let startX = centerX - boardWidth / 2;
      let startY = centerY - boardHeight / 2;
      drawSubBoard(ctx, boards[i], startX, startY, boardWidth, boardHeight);
    }
    for (let winningGroup of superBoard.winningGroups) {
      drawSuperWin(ctx, winningGroup);
    }
    setDrawnBoards(boards);
  });

  return <Box boxShadow={10} style={{width, height}} m={1}>
    <canvas ref={canvasRef} width={width} height={height}/>
  </Box>;
}

export default SuperBoardCanvas;