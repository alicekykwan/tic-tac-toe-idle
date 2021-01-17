import { Box } from '@material-ui/core';
import { UPGRADE_SHOP_SUPER_O_WIN_RESET_DELAY, UPGRADE_SHOP_SUPER_O_SUPER_BOARD_SIZE, UPGRADE_SHOP_SUPER_O_UNLOCK_PRESTIGE } from '../constants/upgradeTypes';
import { COIN_TYPE_SUPER_O } from '../constants/coinTypes'
import UpgradeCard from './UpgradeCard';

function ShopSuperX() {
  return (
    <Box display='flex' flexDirection='column' width='600px' p={1}>
      <UpgradeCard coinType={COIN_TYPE_SUPER_O} upgradeType={UPGRADE_SHOP_SUPER_O_WIN_RESET_DELAY} />
      <UpgradeCard coinType={COIN_TYPE_SUPER_O} upgradeType={UPGRADE_SHOP_SUPER_O_SUPER_BOARD_SIZE} />
      <UpgradeCard coinType={COIN_TYPE_SUPER_O} upgradeType={UPGRADE_SHOP_SUPER_O_UNLOCK_PRESTIGE} />
    </Box>
  );
}

export default ShopSuperX;