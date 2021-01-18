import React from "react";
import { prestigeAction } from "../actions/index";
import { connect } from "react-redux";
import { Box, Button, Card, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@material-ui/core';
import { COIN_TYPE_O, COIN_TYPE_SUPER_O, COIN_TYPE_SUPER_X, COIN_TYPE_X } from "../constants/coinTypes";
import { convertCoinsToStars } from '../game/prestige';

const mapStateToProps = state => {
  return {
    coins: state.coins,
    spent: state.spent,
    canPrestige: state.gameSettings.canPrestige
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

function ConnectedPrestigeCard({ coins, spent, canPrestige, prestige }) {
  const doPrestige = () => {
    // TODO: add confirmation modal that can be disabled in settings
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

  return (
    <Box key='prestige' m={1}>
      <Card>
        <Box display='flex' flexDirection='column' p={1}>
          <Box display='flex' flexDirection='row' m={1}>
            <Box width='55%'>
              <Typography variant='h6'>
                Prestige
              </Typography>
            </Box>
            <Box width='45%' textAlign='right'>
              <Button
                disabled={ !canPrestige }
                variant='contained' color='primary'
                onClick={ doPrestige }>
                Reset game for {totalStars} stars
              </Button>
            </Box>
          </Box>
          <Box display='flex' flexDirection='row' m={1}>
            <Box width='100%'>
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
                  <TableRow>
                    <TableCell colSpan={2} align='right'><b>Total Stars on Prestige</b></TableCell>
                    <TableCell align='right'>{totalStars}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </Box>
          </Box>
        </Box>
      </Card>
    </Box>);
};

const PrestigeCard = connect(
  mapStateToProps,
  mapDispatchToProps
)(ConnectedPrestigeCard);

export default PrestigeCard;