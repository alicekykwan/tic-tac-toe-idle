import React, { useState } from "react";
import { prestigeAction } from "../actions/index";
import { connect } from "react-redux";
import { Box, Button, Card, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@material-ui/core';
import Accordion from '@material-ui/core/Accordion';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import WarningIcon from '@material-ui/icons/Warning';
import { COIN_TYPE_O, COIN_TYPE_SUPER_O, COIN_TYPE_SUPER_X, COIN_TYPE_X } from "../constants/coinTypes";
import { convertCoinsToStars } from '../game/prestige';


const mapStateToProps = state => {
  return {
    coins: state.coins,
    spent: state.spent,
    canPrestige: state.gameSettings.canPrestige,
    confirmPrestige: state.userSettings.confirmPrestige,
  };
};

function mapDispatchToProps(dispatch) {
  return {
    prestige: (payload) => dispatch(prestigeAction(payload)),
  };
}

const COIN_TYPES_AND_NAMES = [
  [COIN_TYPE_X, 'X'],
  [COIN_TYPE_O, 'O'],
  [COIN_TYPE_SUPER_X, 'Super X'],
  [COIN_TYPE_SUPER_O, 'Super O'],
];

function ConnectedPrestigeCard({ coins, spent, canPrestige, confirmPrestige, prestige }) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const handlePrompt = (evt) => {
    evt.stopPropagation();
    evt.preventDefault();
    if (confirmPrestige) {
      setDialogOpen(true);
    } else {
      prestige();
    }
  };

  const handleCancel = () => {
    setDialogOpen(false);
  };

  const handleConfirm = () => {
    setDialogOpen(false);
    prestige();
  };

  let totalStars = 0;
  let tableRows = [];
  for (let [coinType, coinName] of COIN_TYPES_AND_NAMES) {
    let amt = spent[coinType] + coins[coinType];
    let stars = convertCoinsToStars(coinType, amt);
    totalStars += stars;
    tableRows.push(
      <TableRow key={coinType}>
        <TableCell><b>{coinName}</b></TableCell>
        <TableCell align='right'>{amt}</TableCell>
        <TableCell align='right'>{stars}</TableCell>
      </TableRow>);
  }
  tableRows.push(
    <TableRow key='total'>
      <TableCell colSpan={2} align='right'><b>Total Stars on Prestige</b></TableCell>
      <TableCell align='right'>{totalStars}</TableCell>
    </TableRow>);

  return (
    <Box key='prestige' m={1}>
      <Card>
        <Accordion expanded={expanded} onChange={()=>setExpanded(!expanded)}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Box display='flex' flexDirection='row' justifyContent='space-between' width='100%'>
              <Box>
                <Typography variant='h6'>
                  Prestige
                </Typography>
              </Box>
              <Box textAlign='right'>
                <Button
                  disabled={ !canPrestige } startIcon={<WarningIcon/>}
                  variant='contained' color='primary'
                  onClick={ handlePrompt }>
                  Reset progress for {totalStars} stars
                </Button>
              </Box>
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            <Table size='small'>
              <TableHead>
                <TableRow>
                  <TableCell><b>Coin Type</b></TableCell>
                  <TableCell align='right'><b>Total Earned<br/>(Spent + Held)</b></TableCell>
                  <TableCell align='right'><b>Stars Gained<br/>on Prestige</b></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {tableRows}
              </TableBody>
            </Table>
          </AccordionDetails>
        </Accordion>
      </Card>
      <Dialog open={dialogOpen} onClose={handleCancel}>
        <DialogTitle>Prestige</DialogTitle>
        <DialogContent>
          <DialogContentText>
            This will reset all X coins, O coins, super X coins, super O coins,
            and all upgrades purchased using those coins in exchange for star coins.
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
    </Box>);
};

const PrestigeCard = connect(
  mapStateToProps,
  mapDispatchToProps
)(ConnectedPrestigeCard);

export default PrestigeCard;