import { Box } from '@material-ui/core';
import { UPGRADE_SHOP_STAR_BOARD_COUNT, UPGRADE_SHOP_STAR_COINS_PER_WIN, UPGRADE_SHOP_STAR_GAME_SPEED, UPGRADE_SHOP_STAR_PICK_INITIAL_MOVES } from "../constants/upgradeTypes";
import { COIN_TYPE_STAR } from '../constants/coinTypes'
import UpgradeCard from './UpgradeCard'
import PrestigeCard from './PrestigeCard'

function ShopStar() {
  return (
    <Box display='flex' flexDirection='column' width='600px' p={1}>
      <PrestigeCard />
      <UpgradeCard coinType={COIN_TYPE_STAR} upgradeType={UPGRADE_SHOP_STAR_GAME_SPEED} />
      <UpgradeCard coinType={COIN_TYPE_STAR} upgradeType={UPGRADE_SHOP_STAR_COINS_PER_WIN} />
      <UpgradeCard coinType={COIN_TYPE_STAR} upgradeType={UPGRADE_SHOP_STAR_BOARD_COUNT} />
      <UpgradeCard coinType={COIN_TYPE_STAR} upgradeType={UPGRADE_SHOP_STAR_PICK_INITIAL_MOVES} />
      
      
    </Box>
  );
}

export default ShopStar;