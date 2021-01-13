import { Box } from '@material-ui/core';
import { UPGRADE_SHOP_O_BOARD_SIZE, UPGRADE_SHOP_O_PICK_INITIAL_MOVES } from "../constants/upgradeTypes";
import { COIN_TYPE_O } from '../constants/coinTypes'
import UpgradeCard from './UpgradeCard'

function ShopO() {
  return (
    <Box display='flex' flexDirection='column' width='600px' bgcolor='background.default' p={1}>
      <UpgradeCard coinType={COIN_TYPE_O} upgradeType={UPGRADE_SHOP_O_BOARD_SIZE} />
      <UpgradeCard coinType={COIN_TYPE_O} upgradeType={UPGRADE_SHOP_O_PICK_INITIAL_MOVES} />
    </Box>
  );
}

export default ShopO;