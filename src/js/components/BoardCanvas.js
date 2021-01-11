import React, { useEffect, useRef, useState } from "react";
import Box from '@material-ui/core/Box';


function BoardCanvas(props) {
  const boardColor = '#303030';
  const gridColor = '#575757';
  const playerColor = ['#b09ce4', '#ffab91'];
  const winColor = '#ffd700';
  let { board, lastTickTime, width, height, margin, padding } = props;
  let { numRows, numCols, numMovesMade, allMoves } = board;
  let cellWidth = (width-2*padding) / numCols;
  let cellHeight = (height-2*padding) / numRows;
  let gridThickness = cellWidth / 8;
  let pieceWidth = 0.5 * cellWidth;
  let pieceHeight = 0.5 * cellHeight;
  let pieceThickness = cellWidth / 5;
  let canvasRef = useRef(null);
  let [ drawnTick, setDrawnTick ] = useState(null);
  let [ drawnBoard, setDrawnBoard ] = useState(null);

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
      default:
    }
  };

  const drawWin = (ctx, winningGroup) => {
    ctx.beginPath();
    ctx.strokeStyle = winColor;
    ctx.lineWidth = gridThickness;
    let first = true;
    for (let cellIdx of winningGroup) {
      let rowIdx = Math.floor(cellIdx / numCols);
      let colIdx = cellIdx % numCols;
      let centerX = padding + cellWidth * (colIdx + 0.5);
      let centerY = padding + cellHeight * (rowIdx + 0.5);
      if (first) {
        first = false;
        ctx.moveTo(centerX, centerY);
      } else {
        ctx.lineTo(centerX, centerY);
      }
    }
    ctx.stroke();
  }

  useEffect(()=>{
    if (drawnTick === lastTickTime) {
      return;
    }
    const canvasObj = canvasRef.current;
    const ctx = canvasObj.getContext('2d');
    let lastPieceDrawn = 0; // number of valid pieces already drawn
    if (drawnBoard === null ||
        board.numMovesMade < drawnBoard.numMovesMade ||
        board.id !== drawnBoard.id) {
      drawGrid(ctx);
      lastPieceDrawn = 0;
    } else {
      lastPieceDrawn = drawnBoard.numMovesMade;
    }
    let numPlayers = 2;
    for (let move=lastPieceDrawn; move<board.numMovesMade; ++move) {
      drawPiece(
        ctx,
        allMoves[move],
        move % numPlayers);
    }
    if (board.numMovesMade === board.movesUntilWin) {
      for (let winningGroup of board.winningGroups) {
        drawWin(ctx, winningGroup);
      }
    }
    setDrawnTick(lastTickTime);
    setDrawnBoard(board);
  });

  return <Box boxShadow={10} style={{width, height, margin}}>
    <canvas ref={canvasRef} width={width} height={height}/>
  </Box>;
}

export default BoardCanvas;
