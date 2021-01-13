import React, { useState, useEffect, useRef } from 'react'
import Box from '@material-ui/core/Box';
import { COLOR_X, COLOR_O, COLOR_BOARD, COLOR_GRID } from '../constants/colors'

function SelectionCanvas({
    width, height, padding, numRows, numCols,
    selectedMoves, maxNumSelectedCells, makeSelection }) {
  const boardColor = COLOR_BOARD;
  const gridColor = COLOR_GRID;
  const playerColor = [COLOR_X, COLOR_O];
  const hoverColor = ['#555555', '#ffff00'];
  let cellWidth = (width-2*padding) / numCols;
  let cellHeight = (height-2*padding) / numRows;
  let gridThickness = cellWidth / 8;
  let pieceWidth = 0.5 * cellWidth;
  let pieceHeight = 0.5 * cellHeight;
  let pieceThickness = cellWidth / 5;
  let canvasRef = useRef(null);
  let [ hoverCell, setHoverCell ] = useState(-1);
  let [ drawnMoves, setDrawnMoves ] = useState(null);
  let [ drawnHover, setDrawnHover ] = useState(-1);

  const highlightCell = (ctx, cellIdx, highlightColor) => {
    let rowIdx = Math.floor(cellIdx / numCols);
    let colIdx = cellIdx % numCols;
    ctx.beginPath();
    ctx.fillStyle = highlightColor;
    ctx.fillRect(padding + cellWidth * colIdx, padding + cellHeight * rowIdx, cellWidth, cellHeight);
    ctx.stroke();
  }

  const drawGrid = (ctx) => {
    ctx.beginPath();
    ctx.fillStyle = boardColor;
    ctx.fillRect(0, 0, width, height);
    ctx.stroke();
    if (hoverCell >= 0) {
      if (selectedMoves.length < maxNumSelectedCells && !selectedMoves.includes(hoverCell)) {
        highlightCell(ctx, hoverCell, hoverColor[1]);
      } else {
        highlightCell(ctx, hoverCell, hoverColor[0]);
      }
    }
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

  useEffect(()=>{
    if (drawnMoves === selectedMoves && drawnHover === hoverCell) {
      return;
    }
    const canvasObj = canvasRef.current;
    const ctx = canvasObj.getContext('2d');
    const numPlayers = 2;
    drawGrid(ctx);
    for (let move=0; move<selectedMoves.length; ++move) {
      drawPiece(
        ctx,
        selectedMoves[move],
        move % numPlayers);
    }
    setDrawnMoves(selectedMoves);
    setDrawnHover(hoverCell);
  }, [selectedMoves, hoverCell, maxNumSelectedCells]);

  let findCell = (evt) => {
    var rect = evt.target.getBoundingClientRect();
    let x = evt.clientX - rect.left;
    let y = evt.clientY - rect.top;
    let rowIdx = Math.floor((y - padding) / cellHeight);
    let colIdx = Math.floor((x - padding) / cellWidth);
    return (0 <= rowIdx && rowIdx < numRows && 0 <= colIdx && colIdx < numCols)
        ? rowIdx * numCols + colIdx
        : -1;
  };

  let onMouseUp = (evt) => {
    let cell = findCell(evt);
    if (cell >= 0) {
      makeSelection(cell);
    }
  };

  let onMouseMove = (evt) => {
    setHoverCell(findCell(evt));
  };

  let onMouseOut = (evt) => {
    setHoverCell(-1);
  };

  return <Box boxShadow={10} style={{width, height}}>
    <canvas ref={canvasRef} width={width} height={height}
        onMouseUp={onMouseUp} onMouseMove={onMouseMove} onMouseOut={onMouseOut} />
  </Box>;
}


export default SelectionCanvas;