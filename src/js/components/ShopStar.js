import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import Box from '@material-ui/core/Box';
import Paper from '@material-ui/core/Paper';

import { UPGRADE_SHOP_STAR_BOARD_COUNT, UPGRADE_SHOP_STAR_COINS_PER_WIN, UPGRADE_SHOP_STAR_GAME_SPEED, UPGRADE_SHOP_STAR_AUTO_BUY, UPGRADE_SHOP_STAR_PICK_INITIAL_MOVES, UPGRADE_SHOP_STAR_UNLOCK_CHALLENGES } from '../constants/upgradeTypes';
import { COIN_TYPE_STAR } from '../constants/coinTypes';
import UpgradeTabPanel from './UpgradeTabPanel';
import { getUpgradeName } from '../game/upgrades';
import PrestigeGreeting from './PrestigeGreeting';
import TabPanel from './TabPanel';
import { useShopTabStyles } from './styles';

function ShopStar({tabState}) {
  const classes = useShopTabStyles();
  const [activeTab, setActiveTab] = tabState;
  const upgradeTypes = [
    UPGRADE_SHOP_STAR_GAME_SPEED,
    UPGRADE_SHOP_STAR_COINS_PER_WIN,
    UPGRADE_SHOP_STAR_BOARD_COUNT,
    UPGRADE_SHOP_STAR_PICK_INITIAL_MOVES,
    UPGRADE_SHOP_STAR_AUTO_BUY,
    UPGRADE_SHOP_STAR_UNLOCK_CHALLENGES,
  ];

  return (
    <Box display='flex' flexDirection='column' width='600px' p={1}>
      <Box m={1}>
        <Paper>
          <PrestigeGreeting />
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
              <UpgradeTabPanel key={activeTab} coinType={COIN_TYPE_STAR} upgradeType={activeTab} />
            </TabPanel>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
}

export default ShopStar;