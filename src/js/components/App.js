import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { tickAction } from "../actions/index";

import ShopButton from './ShopButton';
import BoardsContainer from "./BoardsContainer";
import { THEME_TYPE, THEME_ELEMENT, getTheme } from '../themes/themes'
import IconButton from '@material-ui/core/IconButton';
import SettingsIcon from '@material-ui/icons/Settings';
import '../../css/App.css';
import { ThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Box from '@material-ui/core/Box';


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

  return (
    <ThemeProvider theme={getTheme(THEME_TYPE.NORMAL, THEME_ELEMENT.MAIN)}>
      <CssBaseline />
      <Box bgcolor="background.default" key="app" className="App">
        <ThemeProvider theme={getTheme(THEME_TYPE.NORMAL, THEME_ELEMENT.HEADER)}>
          <Box bgcolor="background.default" key="app-header" className="App-header" color="text.primary">
            <ul>
              <li key="title"><b>Tic-Tac-Toe<br />Idle</b></li>
              <li key="shop-button-x"><ShopButton key="shop-button-x" coinType="x" /></li>
              <li key="shop-button-o"><ShopButton key="shop-button-o" coinType="o" /></li>
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