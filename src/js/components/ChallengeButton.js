import { connect } from 'react-redux';
import { useState } from 'react';
import Popper from '@material-ui/core/Popper';
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import ArrowDropUpIcon from '@material-ui/icons/ArrowDropUp';

import { THEME_TYPE, THEME_ELEMENT, getTheme } from '../themes/themes';
import { ThemeProvider } from '@material-ui/core/styles';
import ChallengeMenu from './ChallengeMenu';
import { CURRENT_CHALLENGE } from '../constants/upgradeTypes';
import { renderChallenge } from '../game/challenges';
import { INDIVIDUAL_CHALLENGES } from '../constants/challengeTypes';

const mapStateToProps = state => {
  return {
    challenge: state.upgrades[CURRENT_CHALLENGE],
  };
};

const challengeToToggled = (challenge) => {
  let res = [];
  for (let individualChallenge of INDIVIDUAL_CHALLENGES) {
    if (challenge & individualChallenge) {
      res.push(individualChallenge);
    }
  }
  return res;
};

function ConnectedChallengeButton({ menuType, menuOpened, anchorEl, toggleMenu, challenge }) {
  let displayedChallengeState = useState(challenge);
  let toggledState = useState(challengeToToggled(challenge));

  const open = (menuOpened === menuType);
  return (<ThemeProvider theme={getTheme(THEME_TYPE.NORMAL, THEME_ELEMENT.SHOP_STAR)}>
    <Button variant='contained' color='primary' onClick={toggleMenu(menuType)}
      startIcon={ open ? <ArrowDropUpIcon /> : <ArrowDropDownIcon /> }>
      { challenge ? renderChallenge(challenge) : 'Select Challenge' }
    </Button>
    <Popper open={open} anchorEl={anchorEl} placement='bottom' style={{zIndex:1100}}>
      <Box bgcolor='background.default' maxHeight='85vh' overflow='scroll'>
        <ChallengeMenu displayedChallengeState={displayedChallengeState} toggledState={toggledState} />
      </Box>
    </Popper>
  </ThemeProvider>);
}

const ChallengeButton = connect(mapStateToProps)(ConnectedChallengeButton);

export default ChallengeButton;