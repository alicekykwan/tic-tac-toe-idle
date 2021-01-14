import React, { useState } from "react";
import { connect } from "react-redux";
import Popper from '@material-ui/core/Popper';
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';
import Fade from '@material-ui/core/Fade';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import ArrowDropUpIcon from '@material-ui/icons/ArrowDropUp';
import * as COIN_TYPE from "../constants/coinTypes";

import { THEME_TYPE, THEME_ELEMENT, getTheme } from '../themes/themes'
import { ThemeProvider } from '@material-ui/core/styles';
import ShopX from './ShopX';
import ShopO from './ShopO';
import ShopSuperX from './ShopSuperX';
import ShopSuperO from './ShopSuperO';

const mapStateToProps = state => {
  return {
    coins: state.coins
  };
};

function ConnectedShopButton({ menuType, menuOpened, setMenuOpened, anchorEl, setAnchorEl, coins, coinType }) {
  const open = (menuOpened === menuType);

  const handleClick = (event) => {
    if (menuOpened === menuType) {
      setMenuOpened(null);
      setAnchorEl(null);
    } else {
      setMenuOpened(menuType);
      setAnchorEl(event.currentTarget);
    }
  };

  const getButtonText = () => {
    switch (coinType) {
      case COIN_TYPE.COIN_TYPE_X:
        return `${coins[coinType]} X`;
      case COIN_TYPE.COIN_TYPE_O:
        return `${coins[coinType]} O`;
      case COIN_TYPE.COIN_TYPE_SUPER_X:
        return `${coins[coinType]} Super X`;
      case COIN_TYPE.COIN_TYPE_SUPER_O:
        return `${coins[coinType]} Super O`;
      default:
    }
  };

  const getContent = () => {
    switch (coinType) {
      case COIN_TYPE.COIN_TYPE_X:
        return <ShopX key={coinType} />;
      case COIN_TYPE.COIN_TYPE_O:
        return <ShopO key={coinType} />;
      case COIN_TYPE.COIN_TYPE_SUPER_X:
        return <ShopSuperX key={coinType} />;
      case COIN_TYPE.COIN_TYPE_SUPER_O:
        return <ShopSuperO key={coinType} />;
      default:
    }
  };

  const getThemeElement = (coinType) => {
    switch (coinType) {
      case COIN_TYPE.COIN_TYPE_X:
        return THEME_ELEMENT.SHOP_X;
      case COIN_TYPE.COIN_TYPE_O:
        return THEME_ELEMENT.SHOP_O;
      case COIN_TYPE.COIN_TYPE_SUPER_X:
        // might want to change in the future but same color as X for now
        return THEME_ELEMENT.SHOP_X;
      case COIN_TYPE.COIN_TYPE_SUPER_O:
        // might want to change in the future but same color as O for now
        return THEME_ELEMENT.SHOP_O;
      default:
    }
  }

  return (<ThemeProvider theme={getTheme(THEME_TYPE.NORMAL, getThemeElement(coinType))}>
    <Button variant="contained" color="primary" onClick={handleClick}
      startIcon={ open ? <ArrowDropUpIcon /> : <ArrowDropDownIcon /> }>
      { getButtonText() }
    </Button>
    <Popper open={menuOpened===menuType} anchorEl={anchorEl} placement='bottom' transition>
      {({ TransitionProps }) => (
        <Fade {...TransitionProps} timeout={300}>
          <Box bgcolor="background.default">
            {getContent()}
          </Box>
        </Fade>
      )}
    </Popper>
  </ThemeProvider>);
}

const ShopButton = connect(mapStateToProps)(ConnectedShopButton);

export default ShopButton;