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
import { ThemeProvider } from '@material-ui/core/styles';
import { AppBar, Box, Tooltip, Snackbar, SnackbarContent, Typography } from '@material-ui/core';
import AdminDialog from './AdminDialog';

function mapStateToProps(state) {
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

const renderDuration = (durationMillis) => {
  let seconds = Math.floor(durationMillis / 1000);
  if (seconds <= 0) {
    return '';
  }
  let minutes = Math.floor(seconds / 60); seconds %= 60;
  let hours = Math.floor(minutes / 60); minutes %= 60;
  let days = Math.floor(hours / 24); hours %= 24;
  let parts = [];
  if (days) parts.push(days + 'd');
  if (days || hours) parts.push(hours + 'h');
  if (days || hours || minutes) parts.push(minutes + 'm');
  parts.push(seconds + 's');
  return parts.join(' ');
};

function ConnectedAppHeader({ paused, progressLevel, setPaused, lastTickTime }) {
  // Remaining offline progress.
  const [ heartbeat, setHeartbeat ] = useState(Date.now());
  const [ offlineDurationMillis, setOfflineDurationMillis ] = useState(Date.now()-lastTickTime);
  const updateHeartbeat = useCallback(() => setHeartbeat(Date.now()), []);
  useEffect(() => {
    let interval = window.setInterval(updateHeartbeat, 1000);
    return () => window.clearInterval(interval);
  }, [updateHeartbeat]);
  useEffect(() => {
    // Note: need fresh timestamp because heartbeat is stale.
    setOfflineDurationMillis(Date.now()-lastTickTime);
  }, [heartbeat, lastTickTime]);

  // Admin Dialog state.
  const [ adminDialogOpen, setAdminDialogOpen ] = useState(false);

  // Shared state for poppers.
  const [ menuOpened, setMenuOpened ] = useState(null);
  const [ anchorEl, setAnchorEl ] = useState(null);

  const onKeyDown = useCallback((evt) => {
    const { key, repeat } = evt;
    if (repeat) return;
    if (key === 'Escape') {
      setMenuOpened(null);
      setAnchorEl(null);
    } else if (key === 'h') {
      setAdminDialogOpen(true)
    }
  }, []);
  useEffect(() => {
    window.addEventListener('keydown', onKeyDown, true);
    return () => window.removeEventListener('keydown', onKeyDown, true);
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

  // TODO: Provide menuOpened, anchorEl, toggleMenu via Context
  const getShops = () => {
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


  return (
    <ThemeProvider theme={getTheme(THEME_TYPE.NORMAL, THEME_ELEMENT.HEADER)}>
      <AppBar position='sticky' style={{overflow:'scroll'}}>
        <Box key='app-header' bgcolor='background.default' color='text.primary' width='100%'
            display='flex' flexDirection='row' justifyContent='space-between' p={1} pt={2}>
          <Box display='flex' flexDirection='row'>
            <Box key='title' mx={1}>
              <b>Tic-Tac-Toe<br />Idle</b>
            </Box>
            {getShops()}
          </Box>

          <Box display='flex' flexDirection='row'>
            <Tooltip title={(paused ? 'Resume Game' : 'Pause Game')}>
              <Box key='pause' mx={1}>
                <IconButton size='medium'
                  color={ paused ? 'primary' : 'secondary' }
                  children={ paused ? <PlayArrowIcon /> : <PauseIcon /> }
                  onClick={ () => setPaused(!paused)} />
              </Box>
            </Tooltip>
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
      </AppBar>

      <Snackbar open={offlineDurationMillis>=1000}>
        <SnackbarContent message={<Typography>Offline progress remaining: {renderDuration(offlineDurationMillis)}</Typography>} />
      </Snackbar>

      <AdminDialog open={adminDialogOpen} onClose={()=>setAdminDialogOpen(false)} />
    </ThemeProvider>
  );
}

const AppHeader = connect(mapStateToProps, mapDispatchToProps)(ConnectedAppHeader);

export default AppHeader;