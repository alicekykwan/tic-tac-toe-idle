import React, { useEffect } from "react";
import index from '../index'
import { addBasicBoardAction, tickAction, updateBoardSettingsAction } from "../actions/index";
import { connect } from "react-redux";


import '../../css/App.css';

import BoardsContainer from "./BoardsContainer";

const mapStateToProps = state => {
  return {
    coins: state.coins,
    boardSettings: state.boardSettings,
  };
};

function mapDispatchToProps(dispatch) {
  return {
    addBasicBoard: () => dispatch(addBasicBoardAction()),
    tick: () => dispatch(tickAction()),
    updateBoardSettings: (boardSettings) => dispatch(updateBoardSettingsAction(boardSettings)),
  };
}

function ConnectedApp({ coins, boardSettings, addBasicBoard, tick, updateBoardSettings }) {
  useEffect(() => {
    console.log('hello');
    setInterval(tick, 50);
  } ,[]);

  let { numRows, numCols } = boardSettings;

  const increaseBoardSize = () => {
    numRows += 1;
    numCols += 1;
    updateBoardSettings({numRows, numCols});
  };

  const decreaseBoardSize = () => {
    if (numRows === 1) {
      return;
    }
    numRows -= 1;
    numCols -= 1;
    updateBoardSettings({numRows, numCols});
  };

  return (
    <div className="App">
      <button onClick={addBasicBoard}> Add board</button>
      <button onClick={increaseBoardSize}> Increase Board Size</button>
      <button onClick={decreaseBoardSize}> Decrease Board Size</button>
      <p>Board Size: {numRows} by {numCols} (applies on board reset) </p>
      <p>X Coins: {coins.amount_x} </p>
      <p>O Coins: {coins.amount_o} </p>
      <div className="game">
       <BoardsContainer />
      </div>
    </div>
  );
}

const App = connect(
  null,
  mapDispatchToProps
)(ConnectedApp);

export default App;