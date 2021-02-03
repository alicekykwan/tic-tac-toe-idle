import React, { useState } from 'react';
import { prestigeAction, purchaseUpgradeAction } from '../actions/index';
import { connect } from 'react-redux';
import { Box, Button, ButtonGroup, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Table, TableBody, TableCell, TableHead, TableRow } from '@material-ui/core';
import WarningIcon from '@material-ui/icons/Warning';
import { PRESTIGE_COIN_TYPES, convertCoinsToStars, bonusCoinsOnPrestige } from '../game/prestige';
import { COIN_X, COIN_O, COIN_T, COIN_SUPER_X, COIN_SUPER_O, COIN_STAR, renderCoin, renderAmount } from '../constants/coins';
import { COIN_TYPE_X, COIN_TYPE_O, COIN_TYPE_SUPER_O } from '../constants/coinTypes';
import { UPGRADE_SHOP_SUPER_O_UNLOCK_PRESTIGE } from '../constants/upgradeTypes';
import { canPurchase, getNextUpgradeCost } from '../game/upgrades';

const mapStateToProps = state => {
  return {
    coins: state.coins,
    spent: state.spent,
    canPrestige: state.gameSettings.canPrestige,
    prestigeCount: state.stats.prestigeCount,
    startBonusMulti: state.gameSettings.startBonusMulti,
    confirmPrestige: state.userSettings.confirmPrestige,
    unlockedTri: state.unlocks.progressLevel > 3,
  };
};

function mapDispatchToProps(dispatch) {
  return {
    prestige: (payload) => dispatch(prestigeAction(payload)),
    purchasePrestige: () => dispatch(purchaseUpgradeAction({
      upgradeType: UPGRADE_SHOP_SUPER_O_UNLOCK_PRESTIGE,
      upgradeLevel: 0
    })),
  };
};

function ConnectedPrestigeButton({ coins, spent, canPrestige, prestigeCount, startBonusMulti, confirmPrestige, unlockedTri, prestige, purchasePrestige, displayedPrestigeCount }) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);

  const handlePrompt = (evt) => {
    if (confirmPrestige) {
      setConfirmOpen(true);
    } else {
      prestige();
    }
  };

  const handleCancel = () => {
    setConfirmOpen(false);
  };

  const handleConfirm = () => {
    setConfirmOpen(false);
    prestige();
  };

  let totalStars = 0;
  let tableRows = [];
  if (canPrestige) {
    for (let coinType of PRESTIGE_COIN_TYPES) {
      let amt = spent[coinType] + coins[coinType];
      if (amt === 0) {
        continue;
      }
      let stars = convertCoinsToStars(coinType, amt);
      totalStars += stars;
      tableRows.push(
        <TableRow key={coinType}>
          <TableCell><b>{renderCoin(coinType)}</b></TableCell>
          <TableCell align='right'>{amt}</TableCell>
          <TableCell align='right'>{stars}</TableCell>
        </TableRow>);
    }
    tableRows.push(
      <TableRow key='total'>
        <TableCell colSpan={2} align='right'><b>Total</b></TableCell>
        <TableCell align='right'>{totalStars}</TableCell>
      </TableRow>);
  }

  let bonusCoins = bonusCoinsOnPrestige(prestigeCount, startBonusMulti);
  let buttons = null;
  if (canPrestige) {
    buttons = (
      <ButtonGroup>
        <Button
          startIcon={<WarningIcon/>}
          variant='contained' color='primary'
          onClick={ handlePrompt }>
          Prestige to gain {totalStars}&nbsp;{COIN_STAR}
        </Button>
        <Button
          variant='contained' color='primary'
          onClick={()=>setDetailsOpen(true)}
        >
          Details
        </Button>
      </ButtonGroup>
    );
  } else {
    let cost = getNextUpgradeCost(UPGRADE_SHOP_SUPER_O_UNLOCK_PRESTIGE, 0);
    buttons = (
      <Button
        key='upgrade'
        disabled={ !canPurchase(coins, cost) }
        variant='contained' color='primary'
        onClick={ purchasePrestige }>
        Unlock Prestige (cost: {cost[COIN_TYPE_SUPER_O]}&nbsp;{COIN_SUPER_O})
      </Button>
    );
  }

  let displayedCoins = (
    unlockedTri
    ? <span>{COIN_X},&nbsp;{COIN_O},&nbsp;{COIN_SUPER_X},&nbsp;{COIN_SUPER_O},&nbsp;{COIN_T}&nbsp;</span>
    : <span>{COIN_X},&nbsp;{COIN_O},&nbsp;{COIN_SUPER_X},&nbsp;{COIN_SUPER_O}&nbsp;</span>
  );


  return (
    <Box key='prestige' m={1}>
      {buttons}
      <Dialog open={confirmOpen} onClose={handleCancel} maxWidth='md'>
        <DialogTitle>Confirm Prestige</DialogTitle>
        <DialogContent>
          <DialogContentText>
            This will reset all {displayedCoins}
            and all their upgrades in exchange for {totalStars}&nbsp;{COIN_STAR}.
          </DialogContentText>
          <DialogContentText>
            Since you have {displayedPrestigeCount}, you will restart
            with {renderAmount(bonusCoins[COIN_TYPE_X])}&nbsp;{COIN_X}&nbsp;
            and {renderAmount(bonusCoins[COIN_TYPE_O])}&nbsp;{COIN_O}.
          </DialogContentText>
          <DialogContentText>
            Really prestige?
            (This confirmation can be disabled under Settings &gt; Confirmations.)
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button variant='contained' color='primary' onClick={handleCancel}>
            No
          </Button>
          <Button variant='contained' color='primary' onClick={handleConfirm} autoFocus startIcon={<WarningIcon />}>
            Yes
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={detailsOpen} onClose={()=>setDetailsOpen(false)}>
        <DialogTitle>Prestige Breakdown</DialogTitle>
        <DialogContent>
          <Table size='small'>
            <TableHead>
              <TableRow>
                <TableCell />
                <TableCell align='right'><b>Total Earned<br/>(Spent + Held)</b></TableCell>
                <TableCell align='right'><b>{COIN_STAR}&nbsp;Gained<br/>on Prestige</b></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {tableRows}
            </TableBody>
          </Table>
        </DialogContent>
        <DialogActions>
          <Button variant='contained' color='primary' onClick={()=>setDetailsOpen(false)} autoFocus>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>);
};

const PrestigeButton = connect(
  mapStateToProps,
  mapDispatchToProps
)(ConnectedPrestigeButton);

export default PrestigeButton;