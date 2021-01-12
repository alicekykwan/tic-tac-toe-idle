import React, { useState } from "react";
import { UPGRADE_SHOP_O_BOARD_SIZE, UPGRADE_SHOP_O_PICK_INITIAL_MOVES } from "../constants/upgradeTypes";
import { Box } from '@material-ui/core';
import UpgradeCard from './UpgradeCard'

function ShopO() {
  return (
    <Box display='flex' flexDirection='column' width='600px' bgcolor='background.default' p={1}>
      <UpgradeCard coinType='amount_o' upgradeType={UPGRADE_SHOP_O_BOARD_SIZE} />
      <UpgradeCard coinType='amount_o' upgradeType={UPGRADE_SHOP_O_PICK_INITIAL_MOVES} />
    </Box>
  );
}

export default ShopO;