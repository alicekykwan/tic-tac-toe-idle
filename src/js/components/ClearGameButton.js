import { useState } from 'react';
import { Box, ButtonGroup, Button } from '@material-ui/core';
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

function ConnectedClearGameButton({clearGame}) {
  const [ dialogOpen, setDialogOpen ] = useState(false);

  const handleOpen = () => {
    setDialogOpen(true)
  }

  const handleClose = () => {
    setDialogOpen(false);
  };

  const handleClearGame = () => {
    clearGame()
    setDialogOpen(false);
  }
  return (
    <Box display='flex' flexDirection='row' m={1}>
      <Button variant='contained' color='primary' onClick={handleOpen}
          startIcon={<WarningIcon />}>
        Clear Game
      </Button>
      <Dialog open={dialogOpen} onClose={handleClose}>
        <DialogTitle>Clear Game?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Clearing game will erase all progress.
            Are you sure you want to clear game?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button variant='contained' color='primary' onClick={handleClose}>
            No, Cancel
          </Button>
          <Button variant='contained' color='primary' onClick={handleClearGame} autoFocus startIcon={<WarningIcon />}>
            Yes, Clear Game and Reset
          </Button>
        </DialogActions>
      </Dialog>
    </Box>);
};

const ClearGameButton = connect(
  null,
  mapDispatchToProps
)(ConnectedClearGameButton);

export default ClearGameButton;