import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { tickAction } from "../actions/index";

import ShopButton from './ShopButton';
import BoardsContainer from "./BoardsContainer";
import IconButton from '@material-ui/core/IconButton';
import SettingsIcon from '@material-ui/icons/Settings';
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
  useEffect(() => { setInterval(tick, 50); } ,[]);

  return [
    <div key="app-header" className="App-header">
      <ul>
        <li key="title">Tic-Tac-Toe Idle</li>
        <li key="shop-button-x"><ShopButton key="shop-button-x" coinType="x" /></li>
        <li key="shop-button-o"><ShopButton key="shop-button-o" coinType="o" /></li>
        <li key="settings" style={{float: "right"}}>
          <IconButton size="medium" color="inherit" children={<SettingsIcon />}/>
        </li>
      </ul>
    </div>,
    <div key="app" className="App">
      <BoardsContainer />
    </div>
  ];
}

const App = connect(mapStateToProps, mapDispatchToProps)(ConnectedApp);

export default App;