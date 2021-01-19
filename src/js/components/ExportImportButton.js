import { useRef, useState } from 'react';
import { Box, ButtonGroup, Button } from '@material-ui/core';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { deserializeGameState, serializeCurrentGameState } from '../game/save';
import { importSaveAction } from '../actions/index';
import WarningIcon from '@material-ui/icons/Warning';
import { connect } from 'react-redux';

function mapDispatchToProps(dispatch) {
  return {
    importSave: (payload) => dispatch(importSaveAction(payload)),
  };
}

function ConnectedExportImportButton({importSave}) {
  const textAreaRef = useRef(null);
  const [ dialogOpen, setDialogOpen ] = useState(false);
  const [ error, setError ] = useState(false);
  const [ empty, setEmpty ] = useState(true);

  const exportSaveData = () => {
    let textArea = textAreaRef.current;
    textArea.value = serializeCurrentGameState();
    textArea.focus();
    textArea.select();
    setError(false);
    setEmpty(false);
  };

  const importSaveData = (confirmed) => () => {
    if (!confirmed) {
      setDialogOpen(true);
    } else {
      let textArea = textAreaRef.current;
      importSave(textArea.value);
      setDialogOpen(false);
    }
  };

  const handleClose = () => {
    setDialogOpen(false);
  };

  const validate = () => {
    let textArea = textAreaRef.current;
    setError(textArea.value && !deserializeGameState(textArea.value));
    setEmpty(!textArea.value);
  };

  return (
    <Box display='flex' flexDirection='row' m={1}>
      <ButtonGroup>
        <Button variant='contained' color='primary' onClick={exportSaveData}>
          Export Save
        </Button>
        <Button variant='contained' color='primary' onClick={importSaveData(false)}
            startIcon={<WarningIcon color={error?'error':'inherit'} />}
            disabled={error || empty} >
          Import Save
        </Button>
      </ButtonGroup>
      <input
          type='text'
          ref={textAreaRef}
          defaultValue=''
          placeholder='save data'
          onFocus={(evt)=>evt.target.select()}
          onClick={(evt)=>evt.target.select()}
          onChange={validate}
        />
      <Dialog open={dialogOpen} onClose={handleClose}>
        <DialogTitle>Import Save Data?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Importing save data will overwrite the current game data.
            Are you sure you want to import?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button variant='contained' color='primary' onClick={handleClose}>
            No, Cancel
          </Button>
          <Button variant='contained' color='primary' onClick={importSaveData(true)} autoFocus>
            Yes, Import
          </Button>
        </DialogActions>
      </Dialog>
    </Box>);
};

const ExportImportButton = connect(
  null,
  mapDispatchToProps
)(ConnectedExportImportButton);

export default ExportImportButton;