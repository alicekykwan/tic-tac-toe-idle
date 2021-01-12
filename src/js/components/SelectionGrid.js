import React, { useState, useEffect } from 'react'
import { connect } from "react-redux";
import { UPGRADE_SHOP_O_PICK_INITIAL_MOVES } from "../constants/upgradeTypes";
import { setInitialMovesAction } from "../actions/index";
import SelectionCanvas from "./SelectionCanvas";
import { Box, IconButton } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import UndoIcon from '@material-ui/icons/Undo';

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
  let [ oldRows, setOldRows ] = useState(numRows);
  let [ oldCols, setOldCols ] = useState(numCols);
  let [ selectedMoves, setSelectedMoves ] = useState(initialMoves);

  let clearSelection = () => {
    setSelectedMoves([]);
    setInitialMoves([]);
  };

  let undoLastSelection = () => {
    if (selectedMoves.length === 0) {
      return;
    }
    let newSelectedMoves = [...selectedMoves];
    newSelectedMoves.pop();
    setSelectedMoves(newSelectedMoves);
    setInitialMoves(newSelectedMoves);
  };

  let makeSelection = (cell) => {
    if (selectedMoves.length === maxNumSelectedCells) {
      // Don't allow selecting past upgrade level.
      return;
    }
    if (selectedMoves.includes(cell)) {
      // Don't allow selecting an already selected cell.
      return;
    }
    let newSelectedMoves = [...selectedMoves, cell];
    setSelectedMoves(newSelectedMoves);
    setInitialMoves(newSelectedMoves);
  };

  useEffect(() => {
    if (oldRows !== numRows || oldCols !== numCols) {
      setSelectedMoves([]);
      setOldRows(numRows);
      setOldCols(numCols);
    }
  }, [numRows, numCols]);

  if (maxNumSelectedCells === 0) {
    return <div key="selection-grid"></div>;
  }

  return (
    <Box display='flex' flexDirection='row' m={1} justifyContent='center' alignItems='center'>
      <SelectionCanvas key={0} width={240} height={240} padding={10}
          numRows={numRows} numCols={numCols} selectedMoves={selectedMoves}
          maxNumSelectedCells={maxNumSelectedCells}
          makeSelection={makeSelection}/>
      <Box display='flex' flexDirection='column'>
        <IconButton onClick={undoLastSelection} disabled={selectedMoves.length===0} children={<UndoIcon />} />
        <IconButton onClick={clearSelection} disabled={selectedMoves.length===0} children={<DeleteIcon />} />
      </Box>
    </Box>
  );
}

const SelectionGrid = connect(
  mapStateToProps,
  mapDispatchToProps
)(ConnectedSelectionGrid);

export default SelectionGrid;