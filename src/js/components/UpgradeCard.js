import { useState } from 'react';
import * as UPGRADE_TYPES from '../constants/upgradeTypes';
import { purchaseUpgradeAction } from '../actions/index';
import { connect } from 'react-redux';
import { Box, Button, Card, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Typography } from '@material-ui/core';
import { canPurchase, getUpgradeName, getUpgradeDescription, getNextUpgradeCost } from '../game/upgrades';
import ArrowRightAltIcon from '@material-ui/icons/ArrowRightAlt';
import SelectionGrid from './SelectionGrid';
import WarningIcon from '@material-ui/icons/Warning';

function mapStateToProps(state) {
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

function ConnectedUpgradeCard({ upgradeType, coinType, coins, upgrades, purchaseUpgrade, warning, confirm }) {
  const [dialogOpen, setDialogOpen] = useState(false);

  const handlePrompt = () => {
    if (warning && confirm) {
      setDialogOpen(true);
    } else {
      purchaseUpgrade({upgradeType, upgradeLevel});
    }
  };

  const handleCancel = () => {
    setDialogOpen(false);
  };

  const handleConfirm = () => {
    setDialogOpen(false);
    purchaseUpgrade({upgradeType, upgradeLevel});
  };

  let upgradeLevel = upgrades[upgradeType];
  let cost = getNextUpgradeCost(upgradeType, upgradeLevel);
  let upgradeButton = null;
  if (cost === null) {
    upgradeButton = <Button variant='contained' color='primary' disabled>Cannot Upgrade (MAX)</Button>;
  } else {
    upgradeButton = (<Button
      disabled={ !canPurchase(coins, cost) }
      variant='contained' color='primary'
      startIcon={ warning ? <WarningIcon/> : null }
      onClick={ handlePrompt }>
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

          {cost === null
            ?
              <Box display='flex' flexDirection='row' m={1}>
                <Box width='100%'>
                  <Typography>
                    Current (level {upgradeLevel}):<br/>
                    { getUpgradeDescription(upgradeType, upgradeLevel, upgrades) }
                  </Typography>
                </Box>
              </Box>
            :
              <Box display='flex' flexDirection='row' m={1}>
                <Box width='45%'>
                  <Typography>
                    Current (level {upgradeLevel}):<br/>
                    { getUpgradeDescription(upgradeType, upgradeLevel, upgrades) }
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
                    Upgraded (level {upgradeLevel+1}):<br/>
                    { getUpgradeDescription(upgradeType, upgradeLevel+1, upgrades) }
                  </Typography>
                </Box>
              </Box>
          }

          {upgradeType === UPGRADE_TYPES.UPGRADE_SHOP_O_PICK_INITIAL_MOVES
              ? <SelectionGrid key='selection-grid'/>
              : null}
        </Box>
      </Card>
      { warning
        ? <Dialog open={dialogOpen} onClose={handleCancel}>
            <DialogTitle>Confirm Upgrade Purchase</DialogTitle>
            <DialogContent>
              <DialogContentText>
                {warning}
                This purchase cannot be undone. Continue with purchase?
                (This confirmation can be disabled under Settings &gt; Confirmations.)
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button variant='contained' color='primary' onClick={handleCancel}>
                No, Cancel Purchase
              </Button>
              <Button variant='contained' color='primary' onClick={handleConfirm} autoFocus startIcon={<WarningIcon />}>
                Yes, Purchase
              </Button>
            </DialogActions>
          </Dialog>
        : null}
    </Box>);
};

const UpgradeCard = connect(
  mapStateToProps,
  mapDispatchToProps
)(ConnectedUpgradeCard);

export default UpgradeCard;