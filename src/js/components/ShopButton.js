import React, { useState } from "react";
import { connect } from "react-redux";
import { tickAction } from "../actions/index";
import Popover from '@material-ui/core/Popover';
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';
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

function ConnectedShopButton({ coins, coinType }) {

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
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
    <Popover
      id={`shop-${coinType}`}
      open={open}
      anchorEl={anchorEl}
      onClose={handleClose}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'center',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'center',
      }}
    >
      <Box bgcolor="background.default">
        {getContent()}
      </Box>
    </Popover>
  </ThemeProvider>);
}

const ShopButton = connect(mapStateToProps)(ConnectedShopButton);

export default ShopButton;