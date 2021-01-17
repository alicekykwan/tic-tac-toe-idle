import { Box } from '@material-ui/core';
import { UPGRADE_SHOP_STAR_GAME_SPEED } from "../constants/upgradeTypes";
import { COIN_TYPE_STAR } from '../constants/coinTypes'
import UpgradeCard from './UpgradeCard'
import PrestigeCard from './PrestigeCard'

function ShopX() {
  return (
    <Box display='flex' flexDirection='column' width='600px' p={1}>
      <PrestigeCard />
      <UpgradeCard coinType={COIN_TYPE_STAR} upgradeType={UPGRADE_SHOP_STAR_GAME_SPEED} />
    </Box>
  );
}

export default ShopX;