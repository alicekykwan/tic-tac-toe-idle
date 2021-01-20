import { useState } from 'react';
import { Box, Button, Typography, Switch } from '@material-ui/core';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { clearGameAction } from '../actions/index';
import WarningIcon from '@material-ui/icons/Warning';
import { connect } from 'react-redux';

function mapDispatchToProps(dispatch) {
  return {
    clearGame: (payload) => dispatch(clearGameAction(payload)),
  };
}

function ConnectedHardResetButton({clearGame}) {
  const [ buttonVisible, setButtonVisible ] = useState(false);
  const [ dialogOpen, setDialogOpen ] = useState(false);

  const handleClearGame = () => {
    clearGame();
    setDialogOpen(false);
  };

  return (
    <Box display='flex' flexDirection='row' justifyContent='space-between' m={1}>
      <Box display='flex' flexDirection='row' alignItems='center' >
        <Typography> Show Hard Reset Button</Typography>
        <Switch checked={buttonVisible} onChange={()=>setButtonVisible(!buttonVisible)}/>
      </Box>
      <Box flexGrow={1}>
        {buttonVisible
          ? <Button fullWidth variant='contained' color='secondary' onClick={()=>setDialogOpen(true)} startIcon={<WarningIcon />}>
              Hard Reset
            </Button>
          : null}
      </Box>
      <Dialog open={dialogOpen} onClose={()=>setDialogOpen(false)}>
        <DialogTitle>Hard Reset</DialogTitle>
        <DialogContent>
          <DialogContentText>
            This will reset all progress to the initial state and cannot be undone.
            Are you sure you want to continue?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button variant='contained' color='primary' onClick={()=>setDialogOpen(false)}>
            No, Back to Safety
          </Button>
          <Button variant='contained' color='primary' onClick={handleClearGame} autoFocus startIcon={<WarningIcon />}>
            Yes, Proceed with Hard Reset
          </Button>
        </DialogActions>
      </Dialog>
    </Box>);
};

const HardResetButton = connect(
  null,
  mapDispatchToProps
)(ConnectedHardResetButton);

export default HardResetButton;