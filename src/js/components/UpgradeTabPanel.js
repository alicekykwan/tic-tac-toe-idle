import { useEffect, useState } from 'react';
import { UPGRADE_SHOP_O_PICK_INITIAL_MOVES, UPGRADE_WARNING, UPGRADE_EXPLANATION, UPGRADE_SHOP_O_SQUARE_WIN, UPGRADE_SHOP_SUPER_O_SQUARE_WIN } from '../constants/upgradeTypes';
import { changeUserSettingsAction, purchaseUpgradeAction } from '../actions/index';
import { connect } from 'react-redux';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControl, MenuItem, Select, Switch, Typography } from '@material-ui/core';
import { canPurchase, getUpgradeName, getUpgradeDescription, getNextUpgradeCost, cannotUpgradeReason } from '../game/upgrades';
import SelectionGrid from './SelectionGrid';
import WarningIcon from '@material-ui/icons/Warning';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';
import { renderAmount, renderCoin } from '../constants/coins';
import LockIcon from '@material-ui/icons/Lock';

function mapStateToProps(state) {
  return {
    coins: state.coins,
    upgrades: state.upgrades,
    userSettings: state.userSettings,
    canAutomate: state.gameSettings.canAutomate,
    state: state,
  };
};

function mapDispatchToProps(dispatch) {
  return {
    purchaseUpgrade: (payload) => dispatch(purchaseUpgradeAction(payload)),
    setAutoBuyers: (autoBuyers) => dispatch(changeUserSettingsAction({autoBuyers})),
  };
};

function ConnectedUpgradeTabPanel({ upgradeType, coinType, coins, upgrades, purchaseUpgrade, userSettings, setAutoBuyers, canAutomate, state }) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [currentDesc, setCurrentDesc] = useState('');
  const [upgradeDesc, setUpgradeDesc] = useState('');

  let upgradeLevel = upgrades[upgradeType];
  useEffect(() => {
    if (upgradeType) {
      setCurrentDesc(getUpgradeDescription(upgradeType, upgradeLevel, upgrades));
      setUpgradeDesc(getUpgradeDescription(upgradeType, upgradeLevel+1, upgrades));
    }
  }, [upgrades, upgradeType, upgradeLevel]);

  if (!upgradeType) {
    return (
      <Box m={1}>
        <Box mx={2}>
          <Typography variant='h6'>
            Select an Upgrade
          </Typography>
        </Box>
      </Box>
    );
  }

  let cost = getNextUpgradeCost(upgradeType, upgradeLevel);
  let warning = UPGRADE_WARNING[upgradeType];
  if ((upgradeType === UPGRADE_SHOP_O_SQUARE_WIN || upgradeType === UPGRADE_SHOP_SUPER_O_SQUARE_WIN )&& upgradeLevel < 1) {
    warning = null;
  }

  const { autoBuyers, confirmUpgrade } = userSettings;
  const handlePrompt = () => {
    if (warning && confirmUpgrade[upgradeType]) {
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

  const autoBuyer = autoBuyers[upgradeType];

  const setAutoBuyOn = (on) => {
    setAutoBuyers({ ...autoBuyers, [upgradeType]: {...autoBuyer, on}});
  };

  const setAutoBuyLim = (lim) => {
    setAutoBuyers({ ...autoBuyers, [upgradeType]: {...autoBuyer, lim}});
  };

  const getUpgradeButton = () => {
    if (cost === null) {
      return (
        <Button variant='contained' color='primary' disabled>
          Cannot Upgrade (MAX)
        </Button>
      );
    }
    let reason = cannotUpgradeReason(upgradeType, upgradeLevel, state);
    if (reason) {
      return (
        <Button variant='contained' color='primary' startIcon={<LockIcon/>} disabled>
          Cannot Upgrade ({reason})
        </Button>
      );
    } 
    return (
      <Button
        disabled={ !canPurchase(coins, cost) }
        variant='contained' color='primary'
        startIcon={ warning ? <WarningIcon/> : null }
        onClick={ handlePrompt }>
        Upgrade (cost: {renderAmount(cost[coinType])}&nbsp;{renderCoin(coinType)})
      </Button>
    );
  };

  return (
    <Box m={1}>
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
              Current (level {upgradeLevel}): { currentDesc }
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
          {getUpgradeButton()}
        </Box>

        {/* BOX 3  UPGRADED*/}
        {cost !== null && (
          <Box display='flex' flexDirection='row' m={1}>
            <Box width='100%'>
              <Typography color='textSecondary'>
                Upgraded (level {upgradeLevel+1}): { upgradeDesc }
              </Typography>
            </Box>
          </Box>
        )}

        {/* BOX 4  AUTOPURCHASE*/}
        {cost !== null && canAutomate[coinType] && autoBuyer && (
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

        {upgradeType === UPGRADE_SHOP_O_PICK_INITIAL_MOVES && (
          <SelectionGrid key='selection-grid'/>
        )}

        {UPGRADE_EXPLANATION[upgradeType] && (
          <Box display='flex' flexDirection='row' m={1}>
            <Box width='100%'>
              <Typography color='textSecondary'>
                {UPGRADE_EXPLANATION[upgradeType]}
              </Typography>
            </Box>
          </Box>
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