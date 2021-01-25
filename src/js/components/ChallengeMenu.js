import { connect } from 'react-redux';
import { Box, Button, ButtonGroup, Typography, Paper } from '@material-ui/core';
import { startChallengeAction } from '../actions/index';
import { CURRENT_CHALLENGE } from '../constants/upgradeTypes';
import { CHALLENGE_1_SQUARE, CHALLENGE_2_FULLBOARD, CHALLENGE_3_CHAOS, renderChallenge, renderChallengeRules } from '../constants/challenges';

function mapStateToProps(state) {
  return {
    challenge: state.upgrades[CURRENT_CHALLENGE],
  };
};

function mapDispatchToProps(dispatch) {
  return {
    startChallenge: (challenge) => dispatch(startChallengeAction({challenge})),
  };
};

function ConnectedChallengeMenu({ challenge, startChallenge }) {
  return (
    <Box display='flex' flexDirection='column' width='600px' p={1}>
      <Box m={1}>
        <Paper>
          <Box p={1} display='flex' flexDirection='column'>
            <Box m={1}>
              <Typography>Current Challenge: {renderChallenge(challenge)}</Typography>
              <Typography>Current Rules: {renderChallengeRules(challenge)}</Typography>
            </Box>
            <Box m={1}>
              <ButtonGroup>
                <Button variant='contained' color='primary' onClick={()=>startChallenge(0)}>
                  Exit
                </Button>
                <Button variant='contained' color='primary' onClick={()=>startChallenge(CHALLENGE_1_SQUARE)}>
                  I
                </Button>
                <Button variant='contained' color='primary' onClick={()=>startChallenge(CHALLENGE_2_FULLBOARD)}>
                  II
                </Button>
                <Button variant='contained' color='primary' onClick={()=>startChallenge(CHALLENGE_3_CHAOS)}>
                  III
                </Button>
              </ButtonGroup>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
};

const ChallengeMenu = connect(mapStateToProps, mapDispatchToProps)(ConnectedChallengeMenu);

export default ChallengeMenu;