import { useState } from 'react';
import { connect } from 'react-redux';
import { Box, Card, Modal, Paper, Typography } from '@material-ui/core';
import { serializeCurrentGameState } from '../game/save';
import ExportImportButton from './ExportImportButton'

const mapStateToProps = state => {
  return {
    userSettings: state.userSettings,
  };
};



function ConnectedSettingsMenu({ userSettings }) {
  // TODO:
  //   Reset all progress (Clear save game)
  //   Auto-pause game on load/import
  //   Manual Save?

  return (
    <Box display='flex' flexDirection='column' width='600px' p={1}>
      <Box key='save' m={1}>
        <Card>
          <Box display='flex' flexDirection='column' p={1}>
            <ExportImportButton />
          </Box>
        </Card>
      </Box>
    </Box>
    
    );
}

const SettingsMenu = connect(mapStateToProps)(ConnectedSettingsMenu);

export default SettingsMenu;