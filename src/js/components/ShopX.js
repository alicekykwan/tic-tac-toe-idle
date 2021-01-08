import React, { useState } from "react";
import { UPGRADE_SHOP_X_GAME_SPEED, UPGRADE_SHOP_X_BOARD_COUNT, UPGRADE_SHOP_X_COINS_PER_WIN } from "../constants/upgradeTypes";
import { purchaseUpgradeAction } from "../actions/index";
import { canPurchase, getUpgradeName, getUpgradeDescription, getNextUpgradeCost } from "../game/upgrades";
import { connect } from "react-redux";
import '../../css/Shop.css';

const mapStateToProps = state => {
  return {
    coins: state.coins,
    upgrades: state.upgrades
  };
};

function mapDispatchToProps(dispatch) {
  return {
    purchaseUpgradeAction: (payload) => dispatch(purchaseUpgradeAction(payload))
  };
}

function ConnectedShopX({ coins, upgrades, purchaseUpgradeAction }) {
  const renderUpgrade = (upgradeType) => {
    let upgradeLevel = upgrades[upgradeType];
    let res = [
      <h2>{ getUpgradeName(upgradeType) }</h2>,
      <p>Current effect: { getUpgradeDescription(upgradeType, upgradeLevel) }</p>
    ];
    let cost = getNextUpgradeCost(upgradeType, upgradeLevel);
    if (cost === null) {
      res.push(<button enabled="false">Upgrade (MAX)</button>);
    } else {
      res.push(<button
        enabled={ canPurchase(coins, cost) }
        onClick={ ()=>{purchaseUpgradeAction({upgradeType, upgradeLevel})} }>
        Upgrade (cost: { cost.amount_x })
      </button>)
      res.push(<p>Upgraded effect: { getUpgradeDescription(upgradeType, upgradeLevel+1) }</p>);
    }
    return res;
  };

  return (
    <div className="Shop">
      <h1> this is shop X </h1>
      <p> You have {coins.amount_x} X coins. </p>
      { renderUpgrade(UPGRADE_SHOP_X_GAME_SPEED) }
      { renderUpgrade(UPGRADE_SHOP_X_COINS_PER_WIN) }
      { renderUpgrade(UPGRADE_SHOP_X_BOARD_COUNT) }
    </div>
  );
}

const ShopX = connect(
  mapStateToProps,
  mapDispatchToProps
)(ConnectedShopX);

export default ShopX;