import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { processTicksAction } from '../actions/index';

import BoardsContainer from './BoardsContainer';
import { THEME_TYPE, THEME_ELEMENT, getTheme } from '../themes/themes'
import { ThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Box from '@material-ui/core/Box';
import AppHeader from './AppHeader';
import { saveCurrentStateToLocalStorage } from '../game/save';

function mapStateToProps(state) {
  return {
    autoSaveSeconds: state.userSettings.autoSaveSeconds,
  }
};

function mapDispatchToProps(dispatch) {
  return {
    processTicks: () => dispatch(processTicksAction()),
  };
};

function ConnectedApp({ autoSaveSeconds, processTicks }) {
  // Main game loop.
  useEffect(() => {
    let interval = window.setInterval(processTicks, 20);
    return () => window.clearInterval(interval);
  }, [processTicks]);

  // Autosave loop.
  useEffect(() => {
    if (autoSaveSeconds > 0) {
      let interval = window.setInterval(saveCurrentStateToLocalStorage, autoSaveSeconds*1000);
      return () => window.clearInterval(interval);
    }
  }, [autoSaveSeconds]);

  return (
    <ThemeProvider theme={getTheme(THEME_TYPE.NORMAL, THEME_ELEMENT.MAIN)}>
      <CssBaseline />
      <AppHeader />
      <Box bgcolor='background.default'>
        <BoardsContainer />
      </Box>
    </ThemeProvider>
  );
}

const App = connect(mapStateToProps, mapDispatchToProps)(ConnectedApp);

export default App;