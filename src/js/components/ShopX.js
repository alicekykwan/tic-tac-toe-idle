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
  const upgradeTypes = [
    UPGRADE_SHOP_X_GAME_SPEED,
    UPGRADE_SHOP_X_COINS_PER_WIN,
    UPGRADE_SHOP_X_BOARD_COUNT,
    UPGRADE_SHOP_X_CRITICAL_WIN_MULT,
  ];

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
              { upgradeTypes.map((upgradeType) => (
                <Tab key={upgradeType} value={upgradeType} label={getUpgradeName(upgradeType)} />
              ))}
            </Tabs>
            <TabPanel>
              <UpgradeTabPanel key={activeTab} coinType={COIN_TYPE_X} upgradeType={activeTab} />
            </TabPanel>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
};
