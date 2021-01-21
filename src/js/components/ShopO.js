import { Box } from '@material-ui/core';
import { UPGRADE_SHOP_O_BOARD_SIZE, UPGRADE_SHOP_O_PICK_INITIAL_MOVES } from "../constants/upgradeTypes";
import { COIN_TYPE_O } from '../constants/coinTypes'
import UpgradeCard from './UpgradeCard'
import { connect } from 'react-redux';

function mapStateToProps(state) {
  return {
    confirmBoardSize: state.userSettings.confirmBoardSize,
  };
};

function ConnectedShopO({confirmBoardSize}) {
  return (
    <Box display='flex' flexDirection='column' width='600px' bgcolor='background.default' p={1}>
      <UpgradeCard coinType={COIN_TYPE_O} upgradeType={UPGRADE_SHOP_O_PICK_INITIAL_MOVES} />
      <UpgradeCard
        coinType={COIN_TYPE_O} upgradeType={UPGRADE_SHOP_O_BOARD_SIZE}
        warning='This will increase the board size of all newly created boards.'
        confirm={confirmBoardSize}
      />
    </Box>
  );
};

const ShopO = connect(mapStateToProps)(ConnectedShopO);

export default ShopO;