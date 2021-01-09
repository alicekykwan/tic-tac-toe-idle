import React, { useState } from "react";
import { UPGRADE_SHOP_O_BOARD_SIZE, UPGRADE_SHOP_O_PICK_INITIAL_MOVES } from "../constants/upgradeTypes";
import { purchaseUpgradeAction, setInitialMovesAction } from "../actions/index";
import { connect } from "react-redux";
import Button from '@material-ui/core/Button';
import { canPurchase, getUpgradeName, getUpgradeDescription, getNextUpgradeCost } from "../game/upgrades";
import '../../css/Shop.css';
import _ from "lodash";



const mapStateToProps = state => {
  return {
    coins: state.coins,
    upgrades: state.upgrades
  };
};

function mapDispatchToProps(dispatch) {
  return {
    purchaseUpgrade: (payload) => dispatch(purchaseUpgradeAction(payload)),
    setInitialMoves: (payload) => dispatch(setInitialMovesAction(payload)),
  };
}

function ConnectedShopO({ coins, upgrades, purchaseUpgrade, setInitialMoves }) {

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

  const updateInitialMoves = () => {
    setInitialMoves(_.range(upgrades[UPGRADE_SHOP_O_PICK_INITIAL_MOVES]));
  }

  return (
    <div className="Shop">
      { renderUpgrade(UPGRADE_SHOP_O_BOARD_SIZE) }
      <p>Warning! This is not reversible.</p>
      { renderUpgrade(UPGRADE_SHOP_O_PICK_INITIAL_MOVES) }
      <Button 
          variant="contained" color="primary"
          onClick={ ()=>{updateInitialMoves()} }>
        Set Starting Moves
      </Button>
    </div>
  );
}

const ShopO = connect(
  mapStateToProps,
  mapDispatchToProps
)(ConnectedShopO);

export default ShopO;