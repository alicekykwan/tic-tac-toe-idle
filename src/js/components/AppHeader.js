import React from 'react';
import { connect } from 'react-redux';
import { setPausedAction } from '../actions/index';

import LockedButton from './LockedButton';
import ShopButton from './ShopButton';
import { THEME_TYPE, THEME_ELEMENT, getTheme } from '../themes/themes'
import * as COIN_TYPE from '../constants/coinTypes';
import IconButton from '@material-ui/core/IconButton';
import HelpOutlineIcon from '@material-ui/icons/HelpOutline';
import PauseIcon from '@material-ui/icons/Pause';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import SettingsIcon from '@material-ui/icons/Settings';
import TimelineIcon from '@material-ui/icons/Timeline';
import '../../css/App.css';
import { ThemeProvider } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';


const mapStateToProps = state => {
  return {
    paused: state.paused,
    progressLevel: state.unlocks.progressLevel,
  };
};

function mapDispatchToProps(dispatch) {
  return {
    setPaused: (paused) => dispatch(setPausedAction({paused})),
  };
};

function ConnectedAppHeader({ paused, progressLevel, setPaused }) {
  // TODO: use a shared Popper for better navigation.

  let getShops = () => {
    let items = [
      <Box key='shop-button-x' mx={1}>
        <ShopButton key='shop-button-x' coinType={COIN_TYPE.COIN_TYPE_X} />
      </Box>,
      <Box key='shop-button-o' mx={1}>
        <ShopButton key='shop-button-o' coinType={COIN_TYPE.COIN_TYPE_O} />
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
      <Box key='shop-button-superx' mx={1}>
        <ShopButton key='shop-button-superx' coinType={COIN_TYPE.COIN_TYPE_SUPER_X} />
      </Box>);
    items.push(
      <Box key='shop-button-supero' mx={1}>
        <ShopButton key='shop-button-supero' coinType={COIN_TYPE.COIN_TYPE_SUPER_O} />
      </Box>);
    if (progressLevel === 1) {
      items.push(
        <Box key='locked' mx={1}>
          <LockedButton message='unlock prestige' />
        </Box>);
      return items;
    }
    return items;
  };

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
            <IconButton size='medium' color='secondary' children={<SettingsIcon />}/>
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