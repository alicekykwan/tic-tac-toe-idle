import React, { useState } from "react";
//import { UPGRADE_SHOP_ } from "../constants/upgradeTypes";
import { Box } from '@material-ui/core';
import { UPGRADE_SHOP_SUPER_O_DELAY_AFTER_WIN, UPGRADE_SHOP_SUPER_O_SUPER_BOARD_SIZE } from '../constants/upgradeTypes';
import { COIN_TYPE_SUPER_O } from '../constants/coinTypes'
import UpgradeCard from './UpgradeCard';

function ShopSuperX() {
  return (
    <Box display='flex' flexDirection='column' width='600px' p={1}>
      <UpgradeCard coinType={COIN_TYPE_SUPER_O} upgradeType={UPGRADE_SHOP_SUPER_O_DELAY_AFTER_WIN} />
      <UpgradeCard coinType={COIN_TYPE_SUPER_O} upgradeType={UPGRADE_SHOP_SUPER_O_SUPER_BOARD_SIZE} />
    </Box>
  );
}

export default ShopSuperX;