import React, { useCallback, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { setPausedAction } from '../actions/index';

import LockedButton from './LockedButton';
import ShopButton from './ShopButton';
import SettingsButton from './SettingsButton';
import { THEME_TYPE, THEME_ELEMENT, getTheme } from '../themes/themes'
import * as COIN_TYPE from '../constants/coinTypes';
import IconButton from '@material-ui/core/IconButton';
import HelpOutlineIcon from '@material-ui/icons/HelpOutline';
import PauseIcon from '@material-ui/icons/Pause';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import TimelineIcon from '@material-ui/icons/Timeline';
import '../../css/App.css';
import { ThemeProvider } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';


const mapStateToProps = state => {
  return {
    paused: state.paused,
    progressLevel: state.unlocks.progressLevel,
    lastTickTime: state.lastTickTime,
  };
};

function mapDispatchToProps(dispatch) {
  return {
    setPaused: (paused) => dispatch(setPausedAction({paused})),
  };
};

function ConnectedAppHeader({ paused, progressLevel, setPaused, lastTickTime }) {
  const [ menuOpened, setMenuOpened ] = useState(null);
  const [ anchorEl, setAnchorEl ] = useState(null);

  const onKeyDown = useCallback((evt) => {
    const { key, repeat } = evt;
    if (repeat) return;
    if (key === 'Escape') {
      setMenuOpened(null);
      setAnchorEl(null);
    }
  }, []);

  useEffect(() => {
    window.addEventListener("keydown", onKeyDown, true);  
    return () => window.removeEventListener("keydown", onKeyDown, true);
  }, [onKeyDown]);

  const toggleMenu = (menuType) => (evt) => {
    if (menuOpened === menuType) {
      setMenuOpened(null);
      setAnchorEl(null);
    } else {
      setMenuOpened(menuType);
      setAnchorEl(evt.currentTarget);
    }
  };

  let getShops = () => {
    let items = [
      <Box key='x' mx={1}>
        <ShopButton menuType='x'
            menuOpened={menuOpened} anchorEl={anchorEl} toggleMenu={toggleMenu}
            coinType={COIN_TYPE.COIN_TYPE_X} />
      </Box>,
      <Box key='o' mx={1}>
        <ShopButton menuType='o'
            menuOpened={menuOpened} anchorEl={anchorEl} toggleMenu={toggleMenu}
            coinType={COIN_TYPE.COIN_TYPE_O} />
      </Box>,
    ];
    if (progressLevel === 0) {
      items.push(
        <Box key='locked' mx={1}>
          <LockedButton message='reach 9 game boards' />
        </Box>);
      return items;
    }
    items.push(
      <Box key='superx' mx={1}>
        <ShopButton menuType='superx'
            menuOpened={menuOpened} anchorEl={anchorEl} toggleMenu={toggleMenu}
            coinType={COIN_TYPE.COIN_TYPE_SUPER_X} />
      </Box>);
    items.push(
      <Box key='supero' mx={1}>
        <ShopButton menuType='supero'
            menuOpened={menuOpened} anchorEl={anchorEl} toggleMenu={toggleMenu}
            coinType={COIN_TYPE.COIN_TYPE_SUPER_O} />
      </Box>);
    if (progressLevel === 1) {
      items.push(
        <Box key='locked' mx={1}>
          <LockedButton message='unlock prestige' />
        </Box>);
      return items;
    }
    items.push(
      <Box key='star' mx={1}>
        <ShopButton menuType='star'
            menuOpened={menuOpened} anchorEl={anchorEl} toggleMenu={toggleMenu}
            coinType={COIN_TYPE.COIN_TYPE_STAR} />
      </Box>);
    if (progressLevel === 2) {
      items.push(
        <Box key='locked' mx={1}>
          <LockedButton message='unlock challenges' />
        </Box>);
      return items;
    }
    return items;
  };

  let offlineProgressRemaining = () => {
    let timeRemaining = (Date.now()-lastTickTime)/1000;
    if (timeRemaining > 10) {
      return `Offline Progress Remaining: ${timeRemaining} seconds`
    }
    return null
  } 

  return (
    <ThemeProvider theme={getTheme(THEME_TYPE.NORMAL, THEME_ELEMENT.HEADER)}>
      <Box key='app-header' bgcolor='background.default' className='App-header' color='text.primary'
          display='flex' flexDirection='row' justifyContent='space-between' p={1} pt={2}>
        <Box display='flex' flexDirection='row'>
          <Box key='title' mx={1}>
            <b>Tic-Tac-Toe<br />Idle</b>
          </Box>
          {getShops()}
        </Box>

        <Box>{offlineProgressRemaining}</Box>

        <Box display='flex' flexDirection='row'>
          <Box key='pause' mx={1}>
            <IconButton size='medium'
              color={ paused ? 'primary' : 'secondary' }
              children={ paused ? <PlayArrowIcon /> : <PauseIcon /> }
              onClick={ () => setPaused(!paused)} />
          </Box>
          <Box key='stats' mx={1}>
            <IconButton size='medium' color='secondary' children={<TimelineIcon />}/>
          </Box>
          <Box key='settings' mx={1}>
            <SettingsButton menuType='settings'
                menuOpened={menuOpened} anchorEl={anchorEl} toggleMenu={toggleMenu} />
          </Box>
          <Box key='help' mx={1}>
            <IconButton size='medium' color='secondary' children={<HelpOutlineIcon />}/>
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

const AppHeader = connect(mapStateToProps, mapDispatchToProps)(ConnectedAppHeader);

export default AppHeader;