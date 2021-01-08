import React, { useState } from "react";
import { UPGRADE_SHOP_O_BOARD_SIZE } from "../constants/upgradeTypes";
import { purchaseUpgradeAction } from "../actions/index";
import { connect } from "react-redux";
import Button from '@material-ui/core/Button';
import { canPurchase, getUpgradeName, getUpgradeDescription, getNextUpgradeCost } from "../game/upgrades";
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

function ConnectedShopO({ coins, upgrades, purchaseUpgrade }) {

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
        Upgrade (cost: { cost.amount_o })
      </Button>)
      res.push(<p>Upgraded effect: { getUpgradeDescription(upgradeType, upgradeLevel+1) }</p>);
    }
    return res;
  };

  return (
    <div className="Shop">
      <h1> this is shop O </h1>
      <p> You have {coins.amount_o} O coins. </p>
      { renderUpgrade(UPGRADE_SHOP_O_BOARD_SIZE) }


    </div>
  );
}

const ShopO = connect(
  mapStateToProps,
  mapDispatchToProps
)(ConnectedShopO);

export default ShopO;