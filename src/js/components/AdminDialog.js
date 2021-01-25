import { connect } from 'react-redux';
import { adminSetStateAction } from '../actions/index';

import { Box, Button, ButtonGroup, Dialog, DialogContent, DialogTitle, Typography } from '@material-ui/core';
import { THEME_TYPE, THEME_ELEMENT, getTheme } from '../themes/themes'
import { ThemeProvider } from '@material-ui/core/styles';

const timeTravel = (state, seconds) => {
  return {...state, lastTickTime: state.lastTickTime - 1000*seconds};
};

const addAllCoins = (state, amt) => {
  let newCoins = {...state.coins};
  for (let key in newCoins) {
    newCoins[key] += amt;
  }
  return {...state, coins: newCoins};
};

function mapStateToProps(state) {
  return {
    state: state,
  };
};

function mapDispatchToProps(dispatch) {
  return {
    adminSetState: (payload) => dispatch(adminSetStateAction(payload)), 
  };
};

function ConnectedAdminDialog({ open, onClose, state, adminSetState }) {
  return (
    <ThemeProvider theme={getTheme(THEME_TYPE.NORMAL, THEME_ELEMENT.SETTINGS)}>
      <Dialog open={open} onClose={onClose}>
        <DialogTitle>Admin Controls</DialogTitle>
        <DialogContent>
          <Box display='flex' flexDirection='column'>
            <Box display='flex' flexDirection='row' alignItems='center' m={1}>
              <Box>
                <Typography>Time travel</Typography>
              </Box>
              <Box ml={2}>
                <ButtonGroup>
                  <Button onClick={()=>adminSetState(timeTravel(state, 5*60))}>+5 minutes</Button>
                  <Button onClick={()=>adminSetState(timeTravel(state, 15*60))}>+15 minutes</Button>
                  <Button onClick={()=>adminSetState(timeTravel(state, 60*60))}>+1 hour</Button>
                  <Button onClick={()=>adminSetState(timeTravel(state, 4*60*60))}>+4 hours</Button>
                  <Button onClick={()=>adminSetState(timeTravel(state, 24*60*60))}>+24 hours</Button>
                </ButtonGroup>
              </Box>
            </Box>
            <Box display='flex' flexDirection='row' alignItems='center' m={1}>
              <Box>
                <Typography>Coins</Typography>
              </Box>
              <Box ml={2}>
                <ButtonGroup>
                  <Button onClick={()=>adminSetState(addAllCoins(state, 1000))}>+1,000</Button>
                  <Button onClick={()=>adminSetState(addAllCoins(state, 1000000))}>+1,000,000</Button>
                </ButtonGroup>
              </Box>
            </Box>
          </Box>
        </DialogContent>
      </Dialog>
    </ThemeProvider>
  );
}

const AdminDialog = connect(mapStateToProps, mapDispatchToProps)(ConnectedAdminDialog);

export default AdminDialog;