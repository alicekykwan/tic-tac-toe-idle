import { connect } from 'react-redux';
import { useState } from 'react';
import { Box, Button, FormControl, MenuItem, Select, Slider, Switch, Tab, Tabs, Typography, Paper } from '@material-ui/core';
import { saveCurrentStateToLocalStorage } from '../game/save';
import { changeUserSettingsAction } from '../actions/index';
import ExportImportButton from './ExportImportButton'
import HardResetButton from './HardResetButton';
import SaveIcon from '@material-ui/icons/Save';
import LibraryAddCheckIcon from '@material-ui/icons/LibraryAddCheck';
import { getUpgradeName } from '../game/upgrades';
import { UPGRADE_SHOP_O_BOARD_SIZE, UPGRADE_SHOP_O_SQUARE_WIN, UPGRADE_SHOP_SUPER_O_SUPER_BOARD_SIZE, UPGRADE_SHOP_SUPER_O_SQUARE_WIN } from '../constants/upgradeTypes';
import {UNLOCK_UPGRADE_SQUARE} from '../constants/challengeTypes';

function mapStateToProps(state) {
  return {
    userSettings: state.userSettings,
    unlocks: state.unlocks,
  };
};


function mapDispatchToProps(dispatch) {
  return {
    changeUserSettings: (payload) => dispatch(changeUserSettingsAction(payload)),
  };
};

function TabPanel(props) {
  const { children, value, index } = props;
  return (
    <div role='tabpanel' hidden={value !== index}>
      {value === index && children}
    </div>
  );
};

function ConnectedSettingsMenu({ userSettings, unlocks, changeUserSettings }) {
  let { confirmUpgrade } = userSettings;
  const [activeTab, setActiveTab] = useState(0);
  const changeConfirmUpgrade = (upgradeType, value) => {
    changeUserSettings(
      {confirmUpgrade: {...confirmUpgrade, [upgradeType]: value}}
    );
  };

  const saveTabContent = (
    <Box display='flex' flexDirection='column' p={1}>
      <Box display='flex' flexDirection='row' alignItems='center' justifyContent='space-between' m={1}> 
        <Box display='flex' flexDirection='row' alignItems='center'>
          <Box>
            <Typography>Autosave</Typography>
          </Box>
          <Box ml={2}>
            <FormControl>
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
        </Box>
        <Box>
          <Button variant='contained' color='primary' m={1} onClick={saveCurrentStateToLocalStorage}>Save Manually Now</Button>
        </Box>
      </Box>

      <Box display='flex' flexDirection='row' alignItems='center' m={1} >
        <Typography>Pause Game Automatically After Loading</Typography>
        <Switch
            checked={userSettings.pauseOnLoad}
            onChange={(evt)=>changeUserSettings({pauseOnLoad:evt.target.checked})} />
      </Box>
      
      <Box display='flex' flexDirection='row' alignItems='center' m={1}>
        <Box>
          <Typography>Offline Progress Speed</Typography>
        </Box>
        <Box ml={2} flexGrow={1}>
          <Slider
            key={userSettings.maxOfflineSpeed}
            defaultValue={userSettings.maxOfflineSpeed}
            step={1} marks min={1} max={20} color='secondary'
            valueLabelDisplay='auto'
            onChangeCommitted={(evt,val)=>changeUserSettings({maxOfflineSpeed:val})}
          />
        </Box>
      </Box>

      <ExportImportButton />

      <HardResetButton />
    </Box>
  );

  const confirmUpgradeTypes = [
    UPGRADE_SHOP_O_BOARD_SIZE,
    UPGRADE_SHOP_SUPER_O_SUPER_BOARD_SIZE,
  ];
  if (unlocks[UNLOCK_UPGRADE_SQUARE]) {
    confirmUpgradeTypes.push(UPGRADE_SHOP_O_SQUARE_WIN);
    confirmUpgradeTypes.push(UPGRADE_SHOP_SUPER_O_SQUARE_WIN);
  };
  const confirmationTabContent = (
    <Box display='flex' flexDirection='column' p={1}>
      { confirmUpgradeTypes.map((upgradeType) => (
        <Box key={upgradeType} display='flex' flexDirection='row' alignItems='center' m={1} >
          <Typography>Confirm {getUpgradeName(upgradeType)}</Typography>
          <Switch
              checked={confirmUpgrade[upgradeType]}
              onChange={(evt)=>changeConfirmUpgrade(upgradeType, evt.target.checked)} />
        </Box>
      ))}

      <Box display='flex' flexDirection='row' alignItems='center' m={1} >
        <Typography>Confirm Prestige</Typography>
        <Switch
            checked={userSettings.confirmPrestige}
            onChange={(evt)=>changeUserSettings({confirmPrestige:evt.target.checked})} />
      </Box>

      <Box display='flex' flexDirection='row' alignItems='center' m={1} >
        <Typography>Confirm Start Challenge</Typography>
        <Switch
            checked={userSettings.confirmStartChallenge}
            onChange={(evt)=>changeUserSettings({confirmStartChallenge:evt.target.checked})} />
      </Box>
    </Box>
  );

  return (
    <Box display='flex' flexDirection='column' width='600px' p={1}>
      <Paper square>
        <Tabs
          value={activeTab}
          onChange={(evt,val)=>setActiveTab(val)}
          variant='fullWidth'
          indicatorColor='secondary'
          textColor='secondary'
        >
          <Tab icon={<SaveIcon />} label='SAVE' />
          <Tab icon={<LibraryAddCheckIcon />} label='CONFIRMATIONS' />
        </Tabs>
        <TabPanel value={activeTab} index={0}>
          {saveTabContent}
        </TabPanel>
        <TabPanel value={activeTab} index={1}>
          {confirmationTabContent}
        </TabPanel>
      </Paper>
    </Box>
  );
}

const SettingsMenu = connect(mapStateToProps, mapDispatchToProps)(ConnectedSettingsMenu);

export default SettingsMenu;