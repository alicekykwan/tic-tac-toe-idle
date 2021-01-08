import React, { useState } from "react";
import { connect } from "react-redux";
import { tickAction } from "../actions/index";
import Popover from '@material-ui/core/Popover';
import Button from '@material-ui/core/Button';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import ArrowDropUpIcon from '@material-ui/icons/ArrowDropUp';

import ShopX from './ShopX';
import ShopO from './ShopO';
import '../../css/App.css';



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
    if (coinType === 'x') {
      return `X coins: ${coins.amount_x}`;
    } else if (coinType === 'o'){
      return `O coins: ${coins.amount_o}`;
    }
  };

  const getContent = () => {
    if (coinType === 'x') {
      return <ShopX key="shop-x" />;
    } else if (coinType === 'o') {
      return <ShopO key="shop-o" />;
    }
  };

  return (<div>
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
      {getContent()}
    </Popover>
  </div>);
}

const ShopButton = connect(mapStateToProps)(ConnectedShopButton);

export default ShopButton;