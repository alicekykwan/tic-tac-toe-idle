import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { tickAction } from "../actions/index";

import ShopButton from './ShopButton';
import BoardsContainer from "./BoardsContainer";
import { THEME_TYPE, THEME_ELEMENT, getTheme } from '../themes/themes'
import * as COIN_TYPE from "../constants/coinTypes";
import IconButton from '@material-ui/core/IconButton';
import SettingsIcon from '@material-ui/icons/Settings';
import '../../css/App.css';
import { ThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Box from '@material-ui/core/Box';


const mapStateToProps = state => {
  return {
    progressLevel: state.unlocks.progressLevel,
  };
};

function mapDispatchToProps(dispatch) {
  return {
    tick: () => dispatch(tickAction())
  };
};

function ConnectedApp({ progressLevel, tick }) {
  useEffect(() => { setInterval(tick, 50); } ,[]);

  let getShops = () => {
    let items = [
      <li key="shop-button-x"><ShopButton key="shop-button-x" coinType={COIN_TYPE.COIN_TYPE_X} /></li>,
      <li key="shop-button-o"><ShopButton key="shop-button-o" coinType={COIN_TYPE.COIN_TYPE_O} /></li>,
    ];
    if (progressLevel === 0) {
      items.push(<li key="unlock-super">reach 9 boards to unlock super coins</li>);
      return items;
    }
    items.push(<li key="shop-button-superx"><ShopButton key="shop-button-superx" coinType={COIN_TYPE.COIN_TYPE_SUPER_X} /></li>);
    items.push(<li key="shop-button-supero"><ShopButton key="shop-button-supero" coinType={COIN_TYPE.COIN_TYPE_SUPER_O} /></li>);
    return items;
  };

  return (
    <ThemeProvider theme={getTheme(THEME_TYPE.NORMAL, THEME_ELEMENT.MAIN)}>
      <CssBaseline />
      <Box bgcolor="background.default" key="app" className="App">
        <ThemeProvider theme={getTheme(THEME_TYPE.NORMAL, THEME_ELEMENT.HEADER)}>
          <Box bgcolor="background.default" key="app-header" className="App-header" color="text.primary">
            <ul>
              <li key="title"><b>Tic-Tac-Toe<br />Idle</b></li>
              {getShops()}
              <li key="settings" style={{float: "right"}}>
                <IconButton size="medium" color="secondary" children={<SettingsIcon />}/>
              </li>
            </ul>
          </Box>
        </ThemeProvider>
        <Box key="app-boards" className="App-content" >
          <BoardsContainer />
        </Box>
      </Box>
    </ThemeProvider>
  );
}

const App = connect(mapStateToProps, mapDispatchToProps)(ConnectedApp);

export default App;