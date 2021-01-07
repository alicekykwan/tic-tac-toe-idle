import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { tickAction } from "../actions/index";

import ShopButton from './ShopButton';
import BoardsContainer from "./BoardsContainer";
import '../../css/App.css';


const mapStateToProps = state => {
  return {
    coins: state.coins
  };
};

function mapDispatchToProps(dispatch) {
  return {
    tick: () => dispatch(tickAction())
  };
};

function ConnectedApp({ coins, tick }) {
  useEffect(() => {
    console.log('hello');
    setInterval(tick, 50);
  } ,[]);

  return [
    <div class="App-header">
      <ul>
        <li>Tic-Tac-Toe Idle</li>
        <li><ShopButton key="shop-button-x" coinType="x" /></li>
        <li><ShopButton key="shop-button-o" coinType="o" /></li>
        <li style={{float: "right"}}>Settings</li>
      </ul>
    </div>,
    <div class="App">
      <BoardsContainer />
    </div>
  ];
}

const App = connect(mapStateToProps, mapDispatchToProps)(ConnectedApp);

export default App;