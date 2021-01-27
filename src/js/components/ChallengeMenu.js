import { connect } from 'react-redux';
import { Box, Button, Typography, Paper } from '@material-ui/core';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import { startChallengeAction } from '../actions/index';
import { CURRENT_CHALLENGE } from '../constants/upgradeTypes';
import { CHALLENGE_1_SQUARE, CHALLENGE_2_FULLBOARD, CHALLENGE_3_ERASER } from '../constants/challengeTypes';
import { renderChallenge, renderChallengeRules, renderChallengeGoals, renderChallengeRewards } from '../game/challenges';
import _ from 'lodash';

function mapStateToProps(state) {
  return {
    challenge: state.upgrades[CURRENT_CHALLENGE],
    unlocks: state.unlocks,
  };
};

function mapDispatchToProps(dispatch) {
  return {
    startChallenge: (challenge) => dispatch(startChallengeAction({challenge})),
  };
};

const toggledToChallenge = (toggled) => {
  return _.sum(toggled);
};

const buttonStyle = {width:'100px', height:'100px'};

function ConnectedChallengeMenu({ challenge, unlocks, startChallenge, displayedChallengeState, toggledState }) {
  let [ displayedChallenge, setDisplayedChallenge ] = displayedChallengeState;
  let [ toggled, setToggled ] = toggledState;

  const handleChangeToggled = (event, newToggled) => {
    setToggled(newToggled);
    setDisplayedChallenge(toggledToChallenge(newToggled));
  };

  const handleStartChallenge = () => {
    startChallenge(displayedChallenge);
  };

  const handleExitChallenge = () => {
    startChallenge(0);
  };

  let button = null;
  if (challenge === 0) {
    button = (
      <Button
        variant='contained' color='primary'
        style={buttonStyle}
        onClick={handleStartChallenge}
      >
        Start Challenge
      </Button>
    );
  } else {
    button = (
      <Button
        variant='contained' color='primary'
        style={buttonStyle}
        onClick={handleExitChallenge}
      >
        Exit Challenge
      </Button>
    );
  }

  return (
    <Box display='flex' flexDirection='column' width='600px' p={1}>
      <Box m={1}>
        <Paper>
          <Box p={3}>
            <Typography variant='h6'>
              Current Challenge: {renderChallenge(challenge)}
            </Typography>
          </Box>
        </Paper>
      </Box>
      <Box m={1}>
        <Paper>
          <Box display='flex' flexDirection='column' p={1}>
            <Box m={1} display='flex' flexDirection='row' justifyContent='space-around'>
              <Box>
                {button}
              </Box>
              <Box>
                <ToggleButtonGroup value={toggled} onChange={handleChangeToggled}>
                  <ToggleButton value={CHALLENGE_1_SQUARE} style={buttonStyle} disabled={challenge>0}>
                    Challenge I Square
                  </ToggleButton>
                  <ToggleButton value={CHALLENGE_2_FULLBOARD} style={buttonStyle} disabled={challenge>0}>
                    Challenge II Full Board
                  </ToggleButton>
                  <ToggleButton value={CHALLENGE_3_ERASER} style={buttonStyle} disabled={challenge>0}>
                    Challenge III Eraser
                  </ToggleButton>
                </ToggleButtonGroup>
              </Box>
            </Box>
            <Box m={1}>
              <Box>
                <Typography>Rules:</Typography>
                {renderChallengeRules(displayedChallenge)}
                <Typography>Goals:</Typography>
                {renderChallengeGoals(displayedChallenge)}
                <Typography>Rewards:</Typography>
                {renderChallengeRewards(displayedChallenge, unlocks)}
              </Box>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
};

const ChallengeMenu = connect(mapStateToProps, mapDispatchToProps)(ConnectedChallengeMenu);

export default ChallengeMenu;