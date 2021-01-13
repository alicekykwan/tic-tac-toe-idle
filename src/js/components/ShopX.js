import { Box } from '@material-ui/core';
import { UPGRADE_SHOP_X_GAME_SPEED, UPGRADE_SHOP_X_BOARD_COUNT, UPGRADE_SHOP_X_COINS_PER_WIN, UPGRADE_SHOP_X_CRITICAL_WIN_MULTIPLIER } from "../constants/upgradeTypes";
import { COIN_TYPE_X } from '../constants/coinTypes'
import UpgradeCard from './UpgradeCard'

function ShopX() {
  return (
    <Box display='flex' flexDirection='column' width='600px' p={1}>
      <UpgradeCard coinType={COIN_TYPE_X} upgradeType={UPGRADE_SHOP_X_GAME_SPEED} />
      <UpgradeCard coinType={COIN_TYPE_X} upgradeType={UPGRADE_SHOP_X_COINS_PER_WIN} />
      <UpgradeCard coinType={COIN_TYPE_X} upgradeType={UPGRADE_SHOP_X_BOARD_COUNT} />
      <UpgradeCard coinType={COIN_TYPE_X} upgradeType={UPGRADE_SHOP_X_CRITICAL_WIN_MULTIPLIER} />
    </Box>
  );
}

export default ShopX;