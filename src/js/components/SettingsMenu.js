import { connect } from 'react-redux';
import { Box, Button, Card, FormControl, FormControlLabel, InputLabel, MenuItem, Select, Slider, Switch, Typography } from '@material-ui/core';
import { saveCurrentStateToLocalStorage } from '../game/save';
import { changeUserSettingsAction } from '../actions/index';
import ExportImportButton from './ExportImportButton'
import ClearGameButton from './ClearGameButton';

function mapStateToProps(state) {
  return {
    userSettings: state.userSettings,
  };
};


function mapDispatchToProps(dispatch) {
  return {
    changeUserSettings: (payload) => dispatch(changeUserSettingsAction(payload)),
  };
};

function ConnectedSettingsMenu({ userSettings, changeUserSettings }) {
  return (
    <Box display='flex' flexDirection='column' width='600px' p={1}>
      <Box key='save' m={1}>
        <Card>
          <Box display='flex' flexDirection='column' p={1}>
            <ExportImportButton />
            <ClearGameButton />
            <Box display='flex' flexDirection='row' m={1}>
              <FormControlLabel
                control={<Switch checked={userSettings.pauseOnLoad}
                onChange={(evt)=>changeUserSettings({pauseOnLoad:evt.target.checked})}/>}
                label={<Typography>Automatically pause the game after loading</Typography>}
              />
            </Box>
            <Box display='flex' flexDirection='row' m={1}>
              <Button m={1} onClick={saveCurrentStateToLocalStorage}>Manual Save</Button>
              <FormControl>
                <InputLabel shrink>
                  Autosave
                </InputLabel>
                <Select labelId='label' id='select' value={userSettings.autoSaveSeconds}
                    onChange={(evt)=>changeUserSettings({autoSaveSeconds:evt.target.value})}>
                  <MenuItem value={0}>off</MenuItem>
                  <MenuItem value={5}>every 5 seconds</MenuItem>
                  <MenuItem value={15}>every 15 seconds</MenuItem>
                  <MenuItem value={60}>every minute</MenuItem>
                  <MenuItem value={300}>every 5 minutes</MenuItem>
                </Select>
              </FormControl>
            </Box>
            <Box display='flex' flexDirection='row' m={1}>
              <Typography gutterBottom>
                Max Offline Speed
              </Typography>
              <Slider
                value={userSettings.maxOfflineSpeed}
                step={1} marks min={1} max={20} color='secondary'
                valueLabelDisplay='auto'
                onChangeCommitted={(evt,val)=>changeUserSettings({maxOfflineSpeed:val})}
              />
            </Box>
          </Box>
        </Card>
      </Box>
    </Box>
  );
}

const SettingsMenu = connect(mapStateToProps, mapDispatchToProps)(ConnectedSettingsMenu);

export default SettingsMenu;