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
import { COIN_X, COIN_O, COIN_SUPER_X, COIN_SUPER_O, COIN_STAR, renderCoin } from '../constants/coins';


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
  COIN_TYPE_X,
  COIN_TYPE_O,
  COIN_TYPE_SUPER_X,
  COIN_TYPE_SUPER_O,
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
  for (let coinType of COIN_TYPES_AND_NAMES) {
    let amt = spent[coinType] + coins[coinType];
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
                  Reset progress for {totalStars}&nbsp;{COIN_STAR}
                </Button>
              </Box>
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            <Table size='small'>
              <TableHead>
                <TableRow>
                  <TableCell />
                  <TableCell align='right'><b>Total Earned<br/>(Spent + Held)</b></TableCell>
                  <TableCell align='right'><b>{COIN_STAR} Gained<br/>on Prestige</b></TableCell>
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
        <DialogTitle>Confirm Prestige</DialogTitle>
        <DialogContent>
          <DialogContentText>
            <p>
              This will reset all {COIN_X},&nbsp;{COIN_O},&nbsp;{COIN_SUPER_X},&nbsp;{COIN_SUPER_O},
              and all their upgrades in exchange for {totalStars}&nbsp;{COIN_STAR}.
            </p>
            <p>
              Really prestige?
              (This confirmation can be disabled under Settings &gt; Confirmations.)
            </p>
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