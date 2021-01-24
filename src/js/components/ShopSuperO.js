import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import Box from '@material-ui/core/Box';
import Paper from '@material-ui/core/Paper';

import { UPGRADE_SHOP_SUPER_O_WIN_RESET_DELAY, UPGRADE_SHOP_SUPER_O_SUPER_BOARD_SIZE, UPGRADE_SHOP_SUPER_O_UNLOCK_PRESTIGE } from '../constants/upgradeTypes';
import { COIN_TYPE_SUPER_O } from '../constants/coinTypes';
import UpgradeTabPanel from './UpgradeTabPanel';
import { getUpgradeName } from '../game/upgrades';
import ShopGreeting from './ShopGreeting';
import TabPanel from './TabPanel';
import { useShopTabStyles } from './styles';

export default function ShopSuperO({tabState}) {
  const classes = useShopTabStyles();
  const [activeTab, setActiveTab] = tabState;

  return (
    <Box display='flex' flexDirection='column' width='600px' p={1}>
      <Box m={1}>
        <Paper>
          <ShopGreeting coinType={COIN_TYPE_SUPER_O} />
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
              <Tab label={getUpgradeName(UPGRADE_SHOP_SUPER_O_WIN_RESET_DELAY)} />
              <Tab label={getUpgradeName(UPGRADE_SHOP_SUPER_O_SUPER_BOARD_SIZE)} />
              <Tab label={getUpgradeName(UPGRADE_SHOP_SUPER_O_UNLOCK_PRESTIGE)} />
            </Tabs>
            <TabPanel value={activeTab} index={0}>
              <UpgradeTabPanel coinType={COIN_TYPE_SUPER_O} upgradeType={UPGRADE_SHOP_SUPER_O_WIN_RESET_DELAY} showAutoBuy={false} />
            </TabPanel>
            <TabPanel value={activeTab} index={1}>
              <UpgradeTabPanel
                  coinType={COIN_TYPE_SUPER_O} upgradeType={UPGRADE_SHOP_SUPER_O_SUPER_BOARD_SIZE} showAutoBuy={false}
                  warning='This will increase the super-board size and the number of boards required per super-board.'
                  confirm='confirmSuperBoardSize'  />
            </TabPanel>
            <TabPanel value={activeTab} index={2}>
              <UpgradeTabPanel coinType={COIN_TYPE_SUPER_O} upgradeType={UPGRADE_SHOP_SUPER_O_UNLOCK_PRESTIGE} showAutoBuy={false} />
            </TabPanel>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
};
