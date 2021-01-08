import React, { useState } from "react";
import { purchaseUpgradeAction } from "../actions/index";
import { connect } from "react-redux";
import '../../css/Shop.css';


const mapStateToProps = state => {
  return {
    coins: state.coins,
    gameSettings: state.gameSettings
  };
};

function mapDispatchToProps(dispatch) {
  return {
    purchaseUpgradeAction: (payload) => dispatch(purchaseUpgradeAction(payload))
  };
}

function ConnectedShopO({ coins, gameSettings, purchaseUpgradeAction }) {
  return (
    <div className="Shop">
      <h1> this is shop O </h1>
      <p> You have {coins.amount_o} O coins. </p>
    </div>
  );
}

const ShopO = connect(
  mapStateToProps,
  mapDispatchToProps
)(ConnectedShopO);

export default ShopO;