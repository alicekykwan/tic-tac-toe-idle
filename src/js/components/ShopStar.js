import { useState } from 'react';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import Box from '@material-ui/core/Box';
import Paper from '@material-ui/core/Paper';

import { UPGRADE_SHOP_STAR_BOARD_COUNT, UPGRADE_SHOP_STAR_COINS_PER_WIN, UPGRADE_SHOP_STAR_GAME_SPEED, UPGRADE_SHOP_STAR_AUTO_BUY, UPGRADE_SHOP_STAR_PICK_INITIAL_MOVES, UPGRADE_SHOP_STAR_UNLOCK_CHALLENGES } from '../constants/upgradeTypes';
import { COIN_TYPE_STAR } from '../constants/coinTypes';
import UpgradeTabPanel from './UpgradeTabPanel';
import { getUpgradeName } from '../game/upgrades';
import ShopGreeting from './ShopGreeting';
import PrestigeCard from './PrestigeCard';
import TabPanel from './TabPanel';
import { useShopTabStyles } from './styles';

function ShopStar() {
  const classes = useShopTabStyles();
  const [activeTab, setActiveTab] = useState(0);

  return (
    <Box display='flex' flexDirection='column' width='600px' p={1}>
      <Box m={1}>
        <Paper>
          <ShopGreeting coinType={COIN_TYPE_STAR} />
        </Paper>
      </Box>
      <PrestigeCard />
      <Box m={1}>
        <Paper className={classes.root}>
          <Box display='flex'>
            <Tabs
              orientation='vertical'
              variant='scrollable'
              value={activeTab}
              onChange={(evt, val) => setActiveTab(val)}
              className={classes.tabs}
            >
              <Tab label={getUpgradeName(UPGRADE_SHOP_STAR_GAME_SPEED)} />
              <Tab label={getUpgradeName(UPGRADE_SHOP_STAR_COINS_PER_WIN)} />
              <Tab label={getUpgradeName(UPGRADE_SHOP_STAR_BOARD_COUNT)} />
              <Tab label={getUpgradeName(UPGRADE_SHOP_STAR_PICK_INITIAL_MOVES)} />
              <Tab label={getUpgradeName(UPGRADE_SHOP_STAR_AUTO_BUY)} />
              <Tab label={getUpgradeName(UPGRADE_SHOP_STAR_UNLOCK_CHALLENGES)} />
              
            </Tabs>
            <TabPanel value={activeTab} index={0}>
              <UpgradeTabPanel coinType={COIN_TYPE_STAR} upgradeType={UPGRADE_SHOP_STAR_GAME_SPEED} />
            </TabPanel>
            <TabPanel value={activeTab} index={1}>
              <UpgradeTabPanel coinType={COIN_TYPE_STAR} upgradeType={UPGRADE_SHOP_STAR_COINS_PER_WIN} />
            </TabPanel>
            <TabPanel value={activeTab} index={2}>
              <UpgradeTabPanel coinType={COIN_TYPE_STAR} upgradeType={UPGRADE_SHOP_STAR_BOARD_COUNT} />
            </TabPanel>
            <TabPanel value={activeTab} index={3}>
              <UpgradeTabPanel coinType={COIN_TYPE_STAR} upgradeType={UPGRADE_SHOP_STAR_PICK_INITIAL_MOVES} />
            </TabPanel>
            <TabPanel value={activeTab} index={4}>
              <UpgradeTabPanel coinType={COIN_TYPE_STAR} upgradeType={UPGRADE_SHOP_STAR_AUTO_BUY} />
            </TabPanel>
            <TabPanel value={activeTab} index={5}>
              <UpgradeTabPanel coinType={COIN_TYPE_STAR} upgradeType={UPGRADE_SHOP_STAR_UNLOCK_CHALLENGES} />
            </TabPanel>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
}

export default ShopStar;