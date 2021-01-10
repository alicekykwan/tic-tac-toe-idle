import React, { useState, useEffect } from 'react'
import { connect } from "react-redux";
import { UPGRADE_SHOP_O_PICK_INITIAL_MOVES } from "../constants/upgradeTypes";
import { setInitialMovesAction } from "../actions/index";
import { THEME_TYPE, THEME_ELEMENT, getTheme } from '../themes/themes'
import { ThemeProvider } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import '../../css/Board.css';
import '../../css/SelectionGrid.css';

const mapStateToProps = state => {
  return {
    upgrades: state.upgrades,
    boardSettings: state.gameSettings.boardSettings
  };
};

function mapDispatchToProps(dispatch) {
  return {
    setInitialMoves: (payload) => dispatch(setInitialMovesAction(payload)),
  };
}

function ConnectedSelectionGrid({ upgrades, boardSettings, setInitialMoves }) {
  let maxNumSelectedCells = upgrades[UPGRADE_SHOP_O_PICK_INITIAL_MOVES];
  let { numRows, numCols, initialMoves } = boardSettings;

  let computeBoardStateForMoves = (moves) => {
    let newBoardState = new Array(numRows*numCols).fill('');
    for (let i = 0; i < moves.length; ++i) {
      newBoardState[moves[i]] = (i % 2 === 0) ? 'X' : 'O';
    }
    return newBoardState
  };
  let [boardState, setBoardState] = useState(computeBoardStateForMoves(initialMoves));
  let [moveOrder, setMoveOrder] = useState(initialMoves);

  const gridSize = 200;
  const gridMargin = 20;
  let cellSize = gridSize / numRows;

  let clearSelection = () => {
    setBoardState(new Array(numRows*numCols).fill(''));
    setMoveOrder([]);
  }

  let saveAndApply = () => {
    setInitialMoves(moveOrder);
  };

  let loadLastSaved = () => {
    setBoardState(computeBoardStateForMoves(initialMoves));
    setMoveOrder(initialMoves);
  };

  let makeSelection = (cell) => {
    if (moveOrder.length === maxNumSelectedCells) {
      // Don't allow selecting past upgrade level.
      return;
    }
    if (boardState[cell] === 'X' || boardState[cell] === 'O') {
      // Don't allow selecting an already selected cell.
      return;
    }
    let newBoardState = [...boardState];
    newBoardState[cell] = (moveOrder.length % 2 === 0) ? 'X' : 'O';
    setBoardState(newBoardState);
    setMoveOrder([...moveOrder, cell]);
  }

  useEffect(() => {
    if (numRows*numCols !== boardState.length) {
      clearSelection();
    }
  } ,[numRows, numCols]);

  let getCellColor = (cell) => {
    if (boardState[cell] === 'X') {
      return 'text.x';
    } else if (boardState[cell] === 'O') {
      return 'text.o';
    } else {
      return '';
    }
  }

  let getCellText = (cell) => {
    if (boardState[cell] === 'X') {
      return '✘';
    } else if (boardState[cell] === 'O') {
      return 'O';
    } else {
      return '';
    }
  }

  let renderGrid = () => {
    let result = [];
    for (let i = 0; i < numRows; i++) {
      let newRow = [];
      for (let j = 0; j < numCols; j++) {
        let cell = i * numCols + j;
        newRow.push(
          <Box key={cell} className="selection-cell"
              color={getCellColor(cell)}
              style={{
                  width: cellSize,
                  height: cellSize,
                  fontSize: cellSize
              }}
              onClick = {() => makeSelection(cell)}
              disabled={moveOrder.length >= maxNumSelectedCells || boardState[cell] !== ""}>
            {getCellText(cell)}
          </Box>
        );
      }
      result.push(<div key={`row-${i}`} className="selection-row">
          { newRow }
      </div>);
    }
    return result;
  };

  if (maxNumSelectedCells === 0) {
    return <div key="selection-grid"></div>;
  }

  return <div key="selection-grid">
    <ThemeProvider theme={getTheme(THEME_TYPE.NORMAL, THEME_ELEMENT.BOARD)}>
      <Box className="selection-grid" boxShadow={3} bgcolor="background.default"
          style={{width: gridSize, height: gridSize, margin: gridMargin}}>
          { renderGrid() }
      </Box>
    </ThemeProvider>
    <Button variant="contained" color="primary" onClick = {clearSelection}>Clear</Button>
    <Button variant="contained" color="primary" onClick = {saveAndApply}>Save and Apply</Button>
    <Button variant="contained" color="primary" onClick = {loadLastSaved}>Load Last Saved</Button>
  </div>;
}


const SelectionGrid = connect(
  mapStateToProps,
  mapDispatchToProps
)(ConnectedSelectionGrid);

export default SelectionGrid;