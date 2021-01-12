import React, { useState } from "react";
import { UPGRADE_SHOP_X_GAME_SPEED, UPGRADE_SHOP_X_BOARD_COUNT, UPGRADE_SHOP_X_COINS_PER_WIN, UPGRADE_SHOP_X_CRITICAL_WIN_MULTIPLIER } from "../constants/upgradeTypes";
import { Box } from '@material-ui/core';
import UpgradeCard from './UpgradeCard'

function ShopX() {
  return (
    <Box display='flex' flexDirection='column' width='600px' p={1}>
      <UpgradeCard coinType='amount_x' upgradeType={UPGRADE_SHOP_X_GAME_SPEED} />
      <UpgradeCard coinType='amount_x' upgradeType={UPGRADE_SHOP_X_COINS_PER_WIN} />
      <UpgradeCard coinType='amount_x' upgradeType={UPGRADE_SHOP_X_BOARD_COUNT} />
      <UpgradeCard coinType='amount_x' upgradeType={UPGRADE_SHOP_X_CRITICAL_WIN_MULTIPLIER} />
    </Box>
  );
}

export default ShopX;