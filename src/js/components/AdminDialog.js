import { connect } from 'react-redux';
import { addCoinsAction, timeTravelAction } from '../actions/index';

import { Box, Button, ButtonGroup, Dialog, DialogContent, DialogTitle, Typography } from '@material-ui/core';
import { THEME_TYPE, THEME_ELEMENT, getTheme } from '../themes/themes'
import { ThemeProvider } from '@material-ui/core/styles';

function mapStateToProps(state) {
  return {
    paused: state.paused,
  };
};

function mapDispatchToProps(dispatch) {
  return {
    addCoins: (amt) => dispatch(addCoinsAction({amt})), 
    timeTravel: (seconds) => dispatch(timeTravelAction({seconds})),
  };
};

function ConnectedAdminDialog({ open, onClose, addCoins, timeTravel }) {
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
                  <Button onClick={()=>timeTravel(5*60)}>+5 minutes</Button>
                  <Button onClick={()=>timeTravel(15*60)}>+15 minutes</Button>
                  <Button onClick={()=>timeTravel(60*60)}>+1 hour</Button>
                  <Button onClick={()=>timeTravel(4*60*60)}>+4 hours</Button>
                  <Button onClick={()=>timeTravel(24*60*60)}>+24 hours</Button>
                </ButtonGroup>
              </Box>
            </Box>
            <Box display='flex' flexDirection='row' alignItems='center' m={1}>
              <Box>
                <Typography>Coins</Typography>
              </Box>
              <Box ml={2}>
                <ButtonGroup>
                  <Button onClick={()=>addCoins(1000)}>+1,000</Button>
                  <Button onClick={()=>addCoins(1000000)}>+1,000,000</Button>
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