import { Box } from '@material-ui/core';
import { UPGRADE_SHOP_SUPER_X_SUPER_COINS_PER_WIN, UPGRADE_SHOP_SUPER_X_SUPER_BOARD_COUNT, UPGRADE_SHOP_SUPER_X_CRITICAL_SUPER_WIN_MULT } from '../constants/upgradeTypes';
import { COIN_TYPE_SUPER_X } from '../constants/coinTypes'
import UpgradeCard from './UpgradeCard';

function ShopSuperX() {
  return (
    <Box display='flex' flexDirection='column' width='600px' p={1}>
      <UpgradeCard coinType={COIN_TYPE_SUPER_X} upgradeType={UPGRADE_SHOP_SUPER_X_SUPER_COINS_PER_WIN} />
      <UpgradeCard coinType={COIN_TYPE_SUPER_X} upgradeType={UPGRADE_SHOP_SUPER_X_SUPER_BOARD_COUNT} />
      <UpgradeCard coinType={COIN_TYPE_SUPER_X} upgradeType={UPGRADE_SHOP_SUPER_X_CRITICAL_SUPER_WIN_MULT} />
    </Box>
  );
}

export default ShopSuperX;