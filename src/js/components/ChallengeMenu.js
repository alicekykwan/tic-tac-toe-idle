import { useState } from 'react';
import { connect } from 'react-redux';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Typography, Paper } from '@material-ui/core';
import WarningIcon from '@material-ui/icons/Warning';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import { startChallengeAction } from '../actions/index';
import { CURRENT_CHALLENGE } from '../constants/upgradeTypes';
import { CHALLENGE_1_SQUARE, CHALLENGE_2_FULLBOARD, CHALLENGE_3_ERASER } from '../constants/challengeTypes';
import { renderChallenge, renderChallengeRules, renderChallengeGoals, renderChallengeRewards, metAllGoals } from '../game/challenges';

import { PRESTIGE_COIN_TYPES, convertCoinsToStars, bonusCoinsOnPrestige } from '../game/prestige';
import { COIN_X, COIN_O, COIN_SUPER_X, COIN_SUPER_O, COIN_STAR, renderAmount } from '../constants/coins';
import { COIN_TYPE_X, COIN_TYPE_O } from '../constants/coinTypes';
import { useErrorButtonStyles } from './styles';

import _ from 'lodash';


function mapStateToProps(state) {
  return {
    challenge: state.upgrades[CURRENT_CHALLENGE],
    unlocks: state.unlocks,
    maxChallengeSelect: state.gameSettings.maxChallengeSelect,
    coins: state.coins,
    spent: state.spent,
    canPrestige: state.gameSettings.canPrestige,
    prestigeCount: state.stats.prestigeCount,
    startBonusMulti: state.gameSettings.startBonusMulti,
    confirmStartChallenge: state.userSettings.confirmStartChallenge,
    challengeStats: state.challengeStats,
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

function ConnectedChallengeMenu({ challenge, unlocks, maxChallengeSelect, coins, spent, canPrestige, prestigeCount, startBonusMulti, confirmStartChallenge, challengeStats, startChallenge, displayedChallengeState, toggledState }) {
  let [ displayedChallenge, setDisplayedChallenge ] = displayedChallengeState;
  let [ toggled, setToggled ] = toggledState;
  const [ startDialogOpen, setStartDialogOpen ] = useState(false);
  const errorButtonStyles = useErrorButtonStyles();

  const handleChangeToggled = (event, newToggled) => {
    if (newToggled.length >= maxChallengeSelect) {
      newToggled = newToggled.slice(-maxChallengeSelect);
    }
    setToggled(newToggled);
    setDisplayedChallenge(toggledToChallenge(newToggled));
  };

  const handleExitChallenge = () => {
    startChallenge(0);
  };

  const handleCancel = () => {
    setStartDialogOpen(false);
  };

  const handleConfirm = () => {
    startChallenge(displayedChallenge);
    setStartDialogOpen(false);
  }

  const handlePromptStart = () => {
    if (confirmStartChallenge) {
      setStartDialogOpen(true);
    } else {
      startChallenge(displayedChallenge);
    }
  }

  let button = null;
  if (challenge === 0) {
    button = (
      <Button
        key='start'
        variant='contained' color='primary'
        style={buttonStyle}
        onClick={handlePromptStart}
        disabled={displayedChallenge===0}
      >
        { displayedChallenge === 0
          ? 'Select Challenge'
          : 'Start Challenge'
        }
      </Button>
    );
  } else if (!metAllGoals(challenge, challengeStats)) {
    button = (
      <Button
        key='abandon'
        variant='contained' className={errorButtonStyles.root}
        style={buttonStyle}
        onClick={handleExitChallenge}
      >
        Abandon Challenge
      </Button>
    );
  } else {
    button = (
      <Button
        key='complete'
        variant='contained' color='secondary'
        style={buttonStyle}
        onClick={handleExitChallenge}
      >
        Complete Challenge
      </Button>
    );
  }

  let totalStars = 0;
  if (canPrestige) {
    for (let coinType of PRESTIGE_COIN_TYPES) {
      let amt = spent[coinType] + coins[coinType];
      let stars = convertCoinsToStars(coinType, amt);
      totalStars += stars;
    }
  };
  let bonusCoins = bonusCoinsOnPrestige(prestigeCount, startBonusMulti);

  let displayedPrestigeCount = '';
  switch (prestigeCount) {
    case 0:
      displayedPrestigeCount = 'not prestiged';
      break;
    case 1:
      displayedPrestigeCount = 'prestiged once';
      break;
    case 2:
      displayedPrestigeCount = 'prestiged twice';
      break;
    default:
      displayedPrestigeCount = `prestiged ${prestigeCount} times`;
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
                {renderChallengeGoals(displayedChallenge, challengeStats)}
                <Typography>Rewards:</Typography>
                {renderChallengeRewards(displayedChallenge, unlocks)}
              </Box>
            </Box>
          </Box>
        </Paper>
      </Box>

      <Dialog open={startDialogOpen} onClose={handleCancel} maxWidth='md'>
        <DialogTitle>Confirm Start Challenge</DialogTitle>
        <DialogContent>
          <DialogContentText>
            This will reset all {COIN_X},&nbsp;{COIN_O},&nbsp;{COIN_SUPER_X},&nbsp;{COIN_SUPER_O},
            and all their upgrades.
          </DialogContentText>
          <DialogContentText>
            { canPrestige
              ? <span>You will gain {totalStars}&nbsp;{COIN_STAR}.</span>
              : <span>Since prestige is not unlocked, you will not gain any&nbsp;{COIN_STAR}.</span>
            }
          </DialogContentText>
          <DialogContentText>
            Since you have {displayedPrestigeCount}, you will restart
            with {renderAmount(bonusCoins[COIN_TYPE_X])}&nbsp;{COIN_X}&nbsp;
            and {renderAmount(bonusCoins[COIN_TYPE_O])}&nbsp;{COIN_O}.
          </DialogContentText>
          <DialogContentText>
            Really start challenge?
            <br />
            (This confirmation can be disabled under Settings &gt; Confirmations.)
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button variant='contained' color='primary' onClick={handleCancel}>
            No
          </Button>
          <Button variant='contained' color='primary' onClick={handleConfirm} autoFocus startIcon={<WarningIcon />}>
            { totalStars > 0
              ? <span>Yes, Gain {totalStars}&nbsp;{COIN_STAR} and Start Challenge</span>
              : <span>Yes, Start Challenge</span>
            }
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

const ChallengeMenu = connect(mapStateToProps, mapDispatchToProps)(ConnectedChallengeMenu);

export default ChallengeMenu;