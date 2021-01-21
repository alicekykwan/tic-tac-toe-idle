import Popper from '@material-ui/core/Popper';
import IconButton from '@material-ui/core/IconButton';
import Box from '@material-ui/core/Box';
import Fade from '@material-ui/core/Fade';
import SettingsIcon from '@material-ui/icons/Settings';

import SettingsMenu from './SettingsMenu';
import { THEME_TYPE, THEME_ELEMENT, getTheme } from '../themes/themes'
import { ThemeProvider } from '@material-ui/core/styles';

function SettingsButton({ menuType, menuOpened, anchorEl, toggleMenu }) {
  const open = (menuOpened === menuType);
  return (<ThemeProvider theme={getTheme(THEME_TYPE.NORMAL, THEME_ELEMENT.SETTINGS)}>
    <IconButton size='medium' color='primary' onClick={toggleMenu(menuType)} children={<SettingsIcon />} />
    <Popper open={open} anchorEl={anchorEl} placement='bottom' style={{zIndex:1100}} transition>
      {({ TransitionProps }) => (
        <Fade {...TransitionProps} timeout={300}>
          <Box bgcolor='background.default' maxHeight='85vh' overflow='scroll'>
            <SettingsMenu />
          </Box>
        </Fade>
      )}
    </Popper>
  </ThemeProvider>);
}

export default SettingsButton;