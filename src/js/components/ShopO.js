import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import Box from '@material-ui/core/Box';
import Paper from '@material-ui/core/Paper';

import { UPGRADE_SHOP_O_BOARD_SIZE, UPGRADE_SHOP_O_PICK_INITIAL_MOVES } from "../constants/upgradeTypes";
import { COIN_TYPE_O } from '../constants/coinTypes'
import UpgradeTabPanel from './UpgradeTabPanel';
import { getUpgradeName } from '../game/upgrades';
import ShopGreeting from './ShopGreeting';
import TabPanel from './TabPanel';
import { useShopTabStyles } from './styles';

export default function ShopO({tabState}) {
  const classes = useShopTabStyles();
  const [activeTab, setActiveTab] = tabState;

  return (
    <Box display='flex' flexDirection='column' width='600px' p={1}>
      <Box m={1}>
        <Paper>
          <ShopGreeting coinType={COIN_TYPE_O} />
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
              <Tab label={getUpgradeName(UPGRADE_SHOP_O_PICK_INITIAL_MOVES)} />
              <Tab label={getUpgradeName(UPGRADE_SHOP_O_BOARD_SIZE)} />
            </Tabs>
            <TabPanel value={activeTab} index={0}>
              <UpgradeTabPanel coinType={COIN_TYPE_O} upgradeType={UPGRADE_SHOP_O_PICK_INITIAL_MOVES} />
            </TabPanel>
            <TabPanel value={activeTab} index={1}>
              <UpgradeTabPanel
                  coinType={COIN_TYPE_O} upgradeType={UPGRADE_SHOP_O_BOARD_SIZE}
                  warning='This will increase the board size of all newly created boards.'
                  confirm='confirmBoardSize' />
            </TabPanel>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
};
