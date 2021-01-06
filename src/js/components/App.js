import React, { useEffect } from "react";
import index from '../index'
import { addBasicBoardAction, tickAction } from "../actions/index";
import { connect } from "react-redux";

 
import '../../css/App.css';

import BoardsContainer from "./BoardsContainer";

const mapStateToProps = state => {
  return {
    coins: state.coins,
    boardDimension: state.boardDimension
  };
};

function mapDispatchToProps(dispatch) {
  return {
    addBasicBoard: () => dispatch(addBasicBoardAction()),
    tick: () => dispatch(tickAction()),
  };
}

function ConnectedApp({ addBasicBoard, tick, coins, boardDimension }) {
  useEffect(() => {
    console.log('hello');
    setInterval(tick, 800);
  } ,[]);

  return (
    <div className="App">
      <button onClick={addBasicBoard}> Add board</button>
      <p>X Coins: {coins.amount_x} </p>
      <p>O Coins: {coins.amount_o} </p>
      <div className="game">
       <BoardsContainer boardDimension={boardDimension}/>
      </div>
    </div>
  );
}

const App = connect(
  mapStateToProps,
  mapDispatchToProps
)(ConnectedApp);

export default App;