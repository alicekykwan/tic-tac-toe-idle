import { useState } from 'react';
import * as UPGRADE_TYPES from '../constants/upgradeTypes';
import { changeUserSettingsAction, purchaseUpgradeAction } from '../actions/index';
import { connect } from 'react-redux';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControl, MenuItem, Select, Switch, Typography } from '@material-ui/core';
import { canPurchase, getUpgradeName, getUpgradeDescription, getNextUpgradeCost } from '../game/upgrades';
import SelectionGrid from './SelectionGrid';
import WarningIcon from '@material-ui/icons/Warning';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';

function mapStateToProps(state) {
  return {
    coins: state.coins,
    upgrades: state.upgrades,
    userSettings: state.userSettings,
    canAutomate: state.gameSettings.canAutomate,
  };
};

function mapDispatchToProps(dispatch) {
  return {
    purchaseUpgrade: (payload) => dispatch(purchaseUpgradeAction(payload)),
    setAutoBuyers: (autoBuyers) => dispatch(changeUserSettingsAction({autoBuyers})),
  };
};

function ConnectedUpgradeTabPanel({ upgradeType, coinType, coins, upgrades, purchaseUpgrade, warning, confirm, userSettings, setAutoBuyers, canAutomate }) {
  const [dialogOpen, setDialogOpen] = useState(false);

  const handlePrompt = () => {
    if (warning && userSettings[confirm]) {
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

  const { autoBuyers } = userSettings;
  const autoBuyer = autoBuyers[upgradeType];

  const setAutoBuyOn = (on) => {
    setAutoBuyers({ ...autoBuyers, [upgradeType]: {...autoBuyer, on}});
  };

  const setAutoBuyLim = (lim) => {
    setAutoBuyers({ ...autoBuyers, [upgradeType]: {...autoBuyer, lim}});
  };

  let upgradeLevel = upgrades[upgradeType];
  let cost = getNextUpgradeCost(upgradeType, upgradeLevel);
  let upgradeButton = null;

  if (cost === null) {
    upgradeButton = (
      <Button variant='contained' color='primary' disabled>
        Cannot Upgrade (MAX)
      </Button>
    );
  } else {
    upgradeButton = (
      <Button
        disabled={ !canPurchase(coins, cost) }
        variant='contained' color='primary'
        startIcon={ warning ? <WarningIcon/> : null }
        onClick={ handlePrompt }>
        Upgrade (cost: { cost[coinType] })
      </Button>
    );
  }

  return (
    <Box key={`upgrade-${upgradeType}`} m={1}>
      <Box mx={2}>
        <Typography variant='h6'>
          {getUpgradeName(upgradeType)}
        </Typography>
      </Box>

      <Box display='flex' flexDirection='column' p={1}>

        {/* BOX 1 CURRENT*/}
        <Box display='flex' flexDirection='row' m={1}>
          <Box width='100%'>
            <Typography>
              Current (level {upgradeLevel}): { getUpgradeDescription(upgradeType, upgradeLevel, upgrades) }
            </Typography>
          </Box>
        </Box>

        {/* BOX 2  ARROW AND UPGRADE BUTTON*/}
        <Box display='flex' alignItems='center' flexDirection='row' m={1} >
          <Box mx={2}>
            { cost === null
              ? <ArrowDownwardIcon visibility='hidden' />
              : <ArrowDownwardIcon /> }
          </Box>
          {upgradeButton}
        </Box>

        {/* BOX 3  UPGRADED*/}
        {cost !== null && (
          <Box display='flex' flexDirection='row' m={1}>
            <Box width='100%'>
              <Typography color='textSecondary'>
                Upgraded (level {upgradeLevel+1}):{ getUpgradeDescription(upgradeType, upgradeLevel+1, upgrades) }
                </Typography>
            </Box>
          </Box>
        )}

        {/* BOX 4  AUTOPURCHASE*/}
        {cost !== null && canAutomate[coinType] && (
          <Box display='flex' flexDirection='row' alignItems='center' m={1} >
            <Switch
              checked={autoBuyer.on}
              onChange={(evt)=>setAutoBuyOn(evt.target.checked)}
            />
            <Typography>
              Auto buy if below&nbsp;
            </Typography>
            <FormControl>
              <Select labelId='label' id='select' value={autoBuyer.lim}
                onChange={(evt)=>setAutoBuyLim(evt.target.value)}>
                <MenuItem value={1}>1%</MenuItem>
                <MenuItem value={10}>10%</MenuItem>
                <MenuItem value={25}>25%</MenuItem>
                <MenuItem value={100}>100%</MenuItem>
              </Select>
            </FormControl>
            <Typography>
              &nbsp;of held
            </Typography>
          </Box>
        )}

        {upgradeType === UPGRADE_TYPES.UPGRADE_SHOP_O_PICK_INITIAL_MOVES && (
          <SelectionGrid key='selection-grid'/>
        )}
      </Box>
    
    {/* NOT IN THE MAIN PANEL */}
    { warning && (
      <Dialog open={dialogOpen} onClose={handleCancel}>
        <DialogTitle>Confirm Upgrade Purchase</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {warning}
          </DialogContentText>
          <DialogContentText>
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
    )}
    </Box>
  )

};

const UpgradeTabPanel = connect(
  mapStateToProps,
  mapDispatchToProps
)(ConnectedUpgradeTabPanel);

export default UpgradeTabPanel;