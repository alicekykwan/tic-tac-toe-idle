import React from "react";
import * as UPGRADE_TYPES from "../constants/upgradeTypes";
import { purchaseUpgradeAction } from "../actions/index";
import { connect } from "react-redux";
import { Box, Button, Card, Typography } from '@material-ui/core';
import { canPurchase, getUpgradeName, getUpgradeDescription, getNextUpgradeCost } from "../game/upgrades";
import _ from "lodash";
import ArrowRightAltIcon from '@material-ui/icons/ArrowRightAlt';
import SelectionGrid from './SelectionGrid';

const mapStateToProps = state => {
  return {
    coins: state.coins,
    upgrades: state.upgrades
  };
};

function mapDispatchToProps(dispatch) {
  return {
    purchaseUpgrade: (payload) => dispatch(purchaseUpgradeAction(payload)),
  };
}

function ConnectedUpgradeCard({ upgradeType, coinType, coins, upgrades, purchaseUpgrade }) {
  let upgradeLevel = upgrades[upgradeType];
  let cost = getNextUpgradeCost(upgradeType, upgradeLevel);
  let upgradeButton = null;
  if (cost === null) {
    upgradeButton = <Button variant="contained" color="primary" disabled>Cannot Upgrade (MAX)</Button>;
  } else {
    upgradeButton = (<Button
      disabled={ !canPurchase(coins, cost) }
      variant="contained" color="primary"
      onClick={ ()=>{purchaseUpgrade({upgradeType, upgradeLevel})} }>
      Upgrade (cost: { cost[coinType] })
    </Button>);
  }
  return (
    <Box key={`upgrade-${upgradeType}`} m={1}>
      <Card>
        <Box display='flex' flexDirection='column' p={1}>
          <Box display='flex' flexDirection='row' m={1}>
            <Box width='55%'>
              <Typography variant='h6'>
                {getUpgradeName(upgradeType)}
              </Typography>
            </Box>
            <Box width='45%' textAlign='right'>
              {upgradeButton}
            </Box>
          </Box>

          <Box display='flex' flexDirection='row' m={1}>
            <Box width='45%'>
              <Typography>
                Current:<br/>
                { getUpgradeDescription(upgradeType, upgradeLevel) }
              </Typography>
            </Box>
            <Box width='10%' textAlign='center'>
              <Typography>
                <br/>
                <ArrowRightAltIcon/>
              </Typography>
            </Box>
            <Box width='45%'>
              <Typography color='textSecondary'>
                Upgraded:<br/>
                { getUpgradeDescription(upgradeType, upgradeLevel+1) }
              </Typography>
            </Box>
          </Box>

          {upgradeType === UPGRADE_TYPES.UPGRADE_SHOP_O_PICK_INITIAL_MOVES
              ? <SelectionGrid key='selection-grid'/>
              : null}
        </Box>
      </Card>
    </Box>);
};

const UpgradeCard = connect(
  mapStateToProps,
  mapDispatchToProps
)(ConnectedUpgradeCard);

export default UpgradeCard;