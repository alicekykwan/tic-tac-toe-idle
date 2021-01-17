import React from "react";
import { prestigeAction } from "../actions/index";
import { connect } from "react-redux";
import { Box, Button, Card, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@material-ui/core';
import { COIN_TYPE_O, COIN_TYPE_SUPER_O, COIN_TYPE_SUPER_X, COIN_TYPE_X } from "../constants/coinTypes";

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

function ConnectedPrestigeCard({ coins, spent, canPrestige, prestige }) {
  const doPrestige = () => {
    prestige();
  };

  let prestigeButton = (
    <Button
      disabled={ !canPrestige }
      variant='contained' color='primary'
      onClick={ doPrestige }>
      Prestige
    </Button>);

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
              {prestigeButton}
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
                  <TableRow>
                    <TableCell><b>X</b></TableCell>
                    <TableCell align='right'>{spent[COIN_TYPE_X] + coins[COIN_TYPE_X]}</TableCell>
                    <TableCell align='right'>1</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell><b>O</b></TableCell>
                    <TableCell align='right'>{spent[COIN_TYPE_O] + coins[COIN_TYPE_O]}</TableCell>
                    <TableCell align='right'>2</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell><b>Super X</b></TableCell>
                    <TableCell align='right'>{spent[COIN_TYPE_SUPER_X] + coins[COIN_TYPE_SUPER_X]}</TableCell>
                    <TableCell align='right'>3</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell><b>Super O</b></TableCell>
                    <TableCell align='right'>{spent[COIN_TYPE_SUPER_O] + coins[COIN_TYPE_SUPER_O]}</TableCell>
                    <TableCell align='right'>4</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell colSpan={2} align='right'><b>Total Stars on Prestige</b></TableCell>
                    <TableCell align='right'>10</TableCell>
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