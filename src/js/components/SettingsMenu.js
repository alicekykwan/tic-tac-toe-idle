import { connect } from 'react-redux';
import { Box, Button, Card, FormControlLabel, Switch, Typography } from '@material-ui/core';
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

  const togglePauseOnLoad = () => {
    changeUserSettings({pauseOnLoad: !userSettings.pauseOnLoad});
  };

  return (
    <Box display='flex' flexDirection='column' width='600px' p={1}>
      <Box key='save' m={1}>
        <Card>
          <Box display='flex' flexDirection='column' p={1}>
            <ExportImportButton />
            <ClearGameButton />
            <Box display='flex' flexDirection='row' m={1}>
              <FormControlLabel
                control={<Switch checked={userSettings.pauseOnLoad} onChange={togglePauseOnLoad}/>}
                label={<Typography>Automatically pause the game after loading</Typography>}
              />
            </Box>
            <Box display='flex' flexDirection='row' m={1}>
              <Button m={1} onClick={saveCurrentStateToLocalStorage}>Manual Save</Button>
            </Box>
          </Box>
        </Card>
      </Box>
    </Box>
  );
}

const SettingsMenu = connect(mapStateToProps, mapDispatchToProps)(ConnectedSettingsMenu);

export default SettingsMenu;