import { connect } from 'react-redux';
import { useState } from 'react';
import Popper from '@material-ui/core/Popper';
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import ArrowDropUpIcon from '@material-ui/icons/ArrowDropUp';
import * as COIN_TYPE from '../constants/coinTypes';
import { renderCoin, renderAmountShort } from '../constants/coins';

import { THEME_TYPE, THEME_ELEMENT, getTheme } from '../themes/themes';
import { ThemeProvider } from '@material-ui/core/styles';
import ShopX from './ShopX';
import ShopO from './ShopO';
import ShopT from './ShopT';
import ShopSuperX from './ShopSuperX';
import ShopSuperO from './ShopSuperO';
import ShopStar from './ShopStar';


const mapStateToProps = state => {
  return {
    coins: state.coins,
    unlocks: state.unlocks,
  };
};

function ConnectedShopButton({ menuType, menuOpened, anchorEl, toggleMenu, coins, coinType, unlocks}) {
  const open = (menuOpened === menuType);
  const tabState = useState(false);

  const getContent = () => {
    switch (coinType) {
      case COIN_TYPE.COIN_TYPE_X:
        return <ShopX key={coinType} tabState={tabState} />;
      case COIN_TYPE.COIN_TYPE_O:
        return <ShopO key={coinType} tabState={tabState} unlocks={unlocks}/>;
      case COIN_TYPE.COIN_TYPE_SUPER_X:
        return <ShopSuperX key={coinType} tabState={tabState} />;
      case COIN_TYPE.COIN_TYPE_SUPER_O:
        return <ShopSuperO key={coinType} tabState={tabState} unlocks={unlocks}/>;
      case COIN_TYPE.COIN_TYPE_STAR:
        return <ShopStar key={coinType} tabState={tabState} />;
      case COIN_TYPE.COIN_TYPE_T:
        return <ShopT key={coinType} tabState={tabState} />;
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
      case COIN_TYPE.COIN_TYPE_STAR:
        return THEME_ELEMENT.SHOP_STAR;
      case COIN_TYPE.COIN_TYPE_T:
        return THEME_ELEMENT.SHOP_T;
      default:
    }
  }

  return (<ThemeProvider theme={getTheme(THEME_TYPE.NORMAL, getThemeElement(coinType))}>
    <Button variant='contained' color='primary' onClick={toggleMenu(menuType)} style={{minWidth:'135px'}}
      startIcon={ open ? <ArrowDropUpIcon /> : <ArrowDropDownIcon /> }>
      {renderAmountShort(coins[coinType])}&nbsp;{renderCoin(coinType)}
    </Button>
    <Popper open={open} anchorEl={anchorEl} placement='bottom' style={{zIndex:1100}}>
      <Box bgcolor='background.default' maxHeight='85vh' overflow='scroll'>
        {getContent()}
      </Box>
    </Popper>
  </ThemeProvider>);
}

const ShopButton = connect(mapStateToProps)(ConnectedShopButton);

export default ShopButton;