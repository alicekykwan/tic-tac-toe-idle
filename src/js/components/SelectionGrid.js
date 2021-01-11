import React, { useState, useEffect } from 'react'
import { connect } from "react-redux";
import { UPGRADE_SHOP_O_PICK_INITIAL_MOVES } from "../constants/upgradeTypes";
import { setInitialMovesAction } from "../actions/index";
import SelectionCanvas from "./SelectionCanvas";
import Button from '@material-ui/core/Button';
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

  return <div key="selection-grid">
    <SelectionCanvas key={0} width={240} height={240} margin={20} padding={10}
        numRows={numRows} numCols={numCols} selectedMoves={selectedMoves}
        maxNumSelectedCells={maxNumSelectedCells}
        makeSelection={makeSelection}/>
    <Button variant="contained" color="primary"
        onClick = {clearSelection} disabled={selectedMoves.length===0}>
      Clear
    </Button>
    <Button variant="contained" color="primary"
        onClick = {undoLastSelection} disabled={selectedMoves.length===0}>
      Undo
    </Button>
  </div>;
}


const SelectionGrid = connect(
  mapStateToProps,
  mapDispatchToProps
)(ConnectedSelectionGrid);

export default SelectionGrid;