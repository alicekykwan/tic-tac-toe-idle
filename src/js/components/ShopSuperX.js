import React, { useState } from "react";
//import { UPGRADE_SHOP_ } from "../constants/upgradeTypes";
import { Box } from '@material-ui/core';
import { UPGRADE_SHOP_SUPER_X_SUPER_COINS_PER_WIN } from '../constants/upgradeTypes';
import { COIN_TYPE_SUPER_X } from '../constants/coinTypes'
import UpgradeCard from './UpgradeCard';

function ShopSuperX() {
  return (
    <Box display='flex' flexDirection='column' width='600px' p={1}>
      <UpgradeCard coinType={COIN_TYPE_SUPER_X} upgradeType={UPGRADE_SHOP_SUPER_X_SUPER_COINS_PER_WIN} />
    </Box>
  );
}

export default ShopSuperX;