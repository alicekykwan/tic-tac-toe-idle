import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import Box from '@material-ui/core/Box';
import Paper from '@material-ui/core/Paper';

import { UPGRADE_SHOP_SUPER_O_WIN_RESET_DELAY, UPGRADE_SHOP_SUPER_O_SUPER_BOARD_SIZE, UPGRADE_SHOP_SUPER_O_UNLOCK_PRESTIGE, UPGRADE_SHOP_SUPER_O_SQUARE_WIN, UPGRADE_SHOP_SUPER_O_LARGER_WIN_MULT, UPGRADE_SHOP_SUPER_O_UNLOCK_3P } from '../constants/upgradeTypes';
import { COIN_TYPE_SUPER_O } from '../constants/coinTypes';
import UpgradeTabPanel from './UpgradeTabPanel';
import { getUpgradeName } from '../game/upgrades';
import ShopGreeting from './ShopGreeting';
import { useShopTabStyles } from './styles';

import {UNLOCK_UPGRADE_3P, UNLOCK_UPGRADE_SQUARE} from '../constants/challengeTypes';

export default function ShopSuperO({tabState, unlocks}) {
  const classes = useShopTabStyles();
  const [activeTab, setActiveTab] = tabState;
  const upgradeTypes = [
    UPGRADE_SHOP_SUPER_O_WIN_RESET_DELAY,
    UPGRADE_SHOP_SUPER_O_SUPER_BOARD_SIZE,
    UPGRADE_SHOP_SUPER_O_LARGER_WIN_MULT,
    UPGRADE_SHOP_SUPER_O_UNLOCK_PRESTIGE,
  ];
  if (unlocks[UNLOCK_UPGRADE_SQUARE]) {
    upgradeTypes.push(UPGRADE_SHOP_SUPER_O_SQUARE_WIN);
  };
  if (unlocks[UNLOCK_UPGRADE_3P]) {
    upgradeTypes.push(UPGRADE_SHOP_SUPER_O_UNLOCK_3P);
  }


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
              { upgradeTypes.map((upgradeType) => (
                <Tab key={upgradeType} value={upgradeType} label={getUpgradeName(upgradeType)} />
              ))}
            </Tabs>
            <UpgradeTabPanel key={activeTab} coinType={COIN_TYPE_SUPER_O} upgradeType={activeTab} />
          </Box>
        </Paper>
      </Box>
    </Box>
  );
};
