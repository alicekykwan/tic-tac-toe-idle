import React, { useState } from "react";
import { UPGRADE_SHOP_X_GAME_SPEED, UPGRADE_SHOP_X_BOARD_COUNT, UPGRADE_SHOP_X_COINS_PER_WIN, UPGRADE_SHOP_X_CRITICAL_WIN_MULTIPLIER } from "../constants/upgradeTypes";
import { purchaseUpgradeAction } from "../actions/index";
import { canPurchase, getUpgradeName, getUpgradeDescription, getNextUpgradeCost } from "../game/upgrades";
import { connect } from "react-redux";
import Button from '@material-ui/core/Button';
import '../../css/Shop.css';

const mapStateToProps = state => {
  return {
    coins: state.coins,
    upgrades: state.upgrades
  };
};

function mapDispatchToProps(dispatch) {
  return {
    purchaseUpgrade: (payload) => dispatch(purchaseUpgradeAction(payload))
  };
}

function ConnectedShopX({ coins, upgrades, purchaseUpgrade }) {
  const renderUpgrade = (upgradeType) => {
    let upgradeLevel = upgrades[upgradeType];
    let res = [
      <h2>{ getUpgradeName(upgradeType) }</h2>,
      <p>Current effect: { getUpgradeDescription(upgradeType, upgradeLevel) }</p>
    ];
    let cost = getNextUpgradeCost(upgradeType, upgradeLevel);
    if (cost === null) {
      res.push(<Button variant="contained" color="primary" disabled>Upgrade (MAX)</Button>);
    } else {
      res.push(<Button
        disabled={ !canPurchase(coins, cost) }
        variant="contained" color="primary"
        onClick={ ()=>{purchaseUpgrade({upgradeType, upgradeLevel})} }>
        Upgrade (cost: { cost.amount_x })
      </Button>)
      res.push(<p>Upgraded effect: { getUpgradeDescription(upgradeType, upgradeLevel+1) }</p>);
    }
    return res;
  };

  return (
    <div className="Shop">
      { renderUpgrade(UPGRADE_SHOP_X_GAME_SPEED) }
      { renderUpgrade(UPGRADE_SHOP_X_COINS_PER_WIN) }
      { renderUpgrade(UPGRADE_SHOP_X_BOARD_COUNT) }
      { renderUpgrade(UPGRADE_SHOP_X_CRITICAL_WIN_MULTIPLIER) }
    </div>
  );
}

const ShopX = connect(
  mapStateToProps,
  mapDispatchToProps
)(ConnectedShopX);

export default ShopX;