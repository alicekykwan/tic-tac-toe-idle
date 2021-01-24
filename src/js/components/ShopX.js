import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import Box from '@material-ui/core/Box';
import Paper from '@material-ui/core/Paper';

import { UPGRADE_SHOP_X_GAME_SPEED, UPGRADE_SHOP_X_BOARD_COUNT, UPGRADE_SHOP_X_COINS_PER_WIN, UPGRADE_SHOP_X_CRITICAL_WIN_MULT } from '../constants/upgradeTypes';
import { COIN_TYPE_X } from '../constants/coinTypes';
import UpgradeTabPanel from './UpgradeTabPanel';
import { getUpgradeName } from '../game/upgrades';
import ShopGreeting from './ShopGreeting';
import TabPanel from './TabPanel';
import { useShopTabStyles } from './styles';

export default function ShopX({tabState}) {
  const classes = useShopTabStyles();
  const [activeTab, setActiveTab] = tabState;

  return (
    <Box display='flex' flexDirection='column' width='600px' p={1}>
      <Box m={1}>
        <Paper>
          <ShopGreeting coinType={COIN_TYPE_X} />
        </Paper>
      </Box>
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
              <Tab label={getUpgradeName(UPGRADE_SHOP_X_GAME_SPEED)} />
              <Tab label={getUpgradeName(UPGRADE_SHOP_X_COINS_PER_WIN)} />
              <Tab label={getUpgradeName(UPGRADE_SHOP_X_BOARD_COUNT)} />
              <Tab label={getUpgradeName(UPGRADE_SHOP_X_CRITICAL_WIN_MULT)} />
            </Tabs>
            <TabPanel value={activeTab} index={0}>
              <UpgradeTabPanel coinType={COIN_TYPE_X} upgradeType={UPGRADE_SHOP_X_GAME_SPEED} />
            </TabPanel>
            <TabPanel value={activeTab} index={1}>
              <UpgradeTabPanel coinType={COIN_TYPE_X} upgradeType={UPGRADE_SHOP_X_COINS_PER_WIN} />
            </TabPanel>
            <TabPanel value={activeTab} index={2}>
              <UpgradeTabPanel coinType={COIN_TYPE_X} upgradeType={UPGRADE_SHOP_X_BOARD_COUNT} />
            </TabPanel>
            <TabPanel value={activeTab} index={3}>
              <UpgradeTabPanel coinType={COIN_TYPE_X} upgradeType={UPGRADE_SHOP_X_CRITICAL_WIN_MULT} />
            </TabPanel>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
};
