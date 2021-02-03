import { CHALLENGE_1_SQUARE, CHALLENGE_2_FULLBOARD, CHALLENGE_3_ERASER, UNLOCK_UPGRADE_SQUARE, UNLOCK_UPGRADE_FULL, UNLOCK_UPGRADE_3P } from '../constants/challengeTypes';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ArrowRightRoundedIcon from '@material-ui/icons/ArrowRightRounded';
import DoneIcon from '@material-ui/icons/Done';
import { COIN_X, COIN_O, COIN_SUPER_O } from '../constants/coins';

const bullet = <ArrowRightRoundedIcon />;
const done = <DoneIcon />;

export const renderChallenge = (challenge) => {
  if (challenge === 0) {
    return 'No Challenge Active';
  }
  let res = [];
  if (challenge & CHALLENGE_1_SQUARE) {
    res.push('I');
  }
  if (challenge & CHALLENGE_2_FULLBOARD) {
    res.push('II');
  }
  if (challenge & CHALLENGE_3_ERASER) {
    res.push('III');
  }
  return `Challenge ${res.join(' + ')} Active`;
};

export const renderChallengeRules = (challenge) => {
  let listItems = [];
  if (challenge === 0) {
    listItems.push(
      <ListItem key={0}>
        <ListItemIcon children={bullet} />
        <ListItemText>No special rules.</ListItemText>
      </ListItem>
    );
  }
  if (challenge & CHALLENGE_1_SQUARE) {
    listItems.push(
      <ListItem key={CHALLENGE_1_SQUARE}>
        <ListItemIcon children={bullet} />
        <ListItemText>Can only win with a 2x2 square.</ListItemText>
      </ListItem>
    );
  }
  if (challenge & CHALLENGE_2_FULLBOARD) {
    listItems.push(
      <ListItem key={CHALLENGE_2_FULLBOARD}>
        <ListItemIcon children={bullet} />
        <ListItemText>Only wins that fill a board or super-board give rewards.</ListItemText>
      </ListItem>
    );
  }
  if (challenge & CHALLENGE_3_ERASER) {
    listItems.push(
      <ListItem key={CHALLENGE_3_ERASER}>
        <ListItemIcon children={bullet} />
        <ListItemText>Players can remove pieces at random.</ListItemText>
      </ListItem>
    );
  }
  return <List>{listItems}</List>
};

export const resetChallengeStats = (challengeStats) => {
  challengeStats.maxStarsOnPrestige = 0;
};

export const renderChallengeGoals = (challenge, challengeStats) => {
  return (
    <List>
      <ListItem>
        <ListItemIcon children={challengeStats.maxStarsOnPrestige > 0 ? done : bullet} />
        <ListItemText>Prestige.</ListItemText>
      </ListItem>
    </List>
  );
};

export const updateChallengeUnlocks = (mutableUnlocks, challenge, challengeStats) => {
  if (!metAllGoals(challenge, challengeStats)) {
    return;
  }
  if (challenge & CHALLENGE_1_SQUARE) {
    mutableUnlocks[UNLOCK_UPGRADE_SQUARE] = true;
  }
  if (challenge & CHALLENGE_2_FULLBOARD) {
    mutableUnlocks[UNLOCK_UPGRADE_FULL] = true;
  }
  if (challenge & CHALLENGE_3_ERASER) {
    mutableUnlocks[UNLOCK_UPGRADE_3P] = true;
  }
};

export const metAllGoals = (challenge, challengeStats) => {
  return challengeStats.maxStarsOnPrestige > 0;
};

const getRewardsForChallenge = (challenge) => {
  let res = [];
  if (challenge & CHALLENGE_1_SQUARE) {
    res.push(UNLOCK_UPGRADE_SQUARE);
  }
  if (challenge & CHALLENGE_2_FULLBOARD) {
    res.push(UNLOCK_UPGRADE_FULL);
  }
  if (challenge & CHALLENGE_3_ERASER) {
    res.push(UNLOCK_UPGRADE_3P);
  }
  return res;
};

const getRewardDescription = (reward) => {
  // TODO format coins
  switch (reward) {
    case UNLOCK_UPGRADE_SQUARE:
      return <span>Unlock&nbsp;{COIN_O}&nbsp;and&nbsp;{COIN_SUPER_O}&nbsp;shop upgrades that allows winning and super-winning by forming squares (in addition to lines).</span>;
    case UNLOCK_UPGRADE_FULL:
      return <span>Unlock an&nbsp;{COIN_X}&nbsp;shop upgrade that increases rewards for each extra move taken.</span>;
    case UNLOCK_UPGRADE_3P:
      return <span>Unlock a&nbsp;{COIN_SUPER_O}&nbsp;shop upgrade to add a third player.</span>;
    default:
      return `Unknown challenge reward: ${reward}.`;
  }
}

export const renderChallengeRewards = (challenge, unlocks) => {
  let rewards = getRewardsForChallenge(challenge);
  if (rewards.length === 0) {
    return (
      <List>
        <ListItem>
          <ListItemIcon children={bullet} />
          <ListItemText>No rewards.</ListItemText>
        </ListItem>
      </List>
    );
  }
  return (
    <List>
      {rewards.map((reward) => (
        <ListItem key={reward}>
          <ListItemIcon children={unlocks[reward]?done:bullet} />
          <ListItemText>{getRewardDescription(reward)}</ListItemText>
        </ListItem>
      ))}
    </List>
  );
};

export const canStartChallenge = (challenge, maxChallengeSelect) => {
  let numChallengeSelect = 0;
  if (challenge & CHALLENGE_1_SQUARE) {
    ++numChallengeSelect;
  }
  if (challenge & CHALLENGE_2_FULLBOARD) {
    ++numChallengeSelect;
  }
  if (challenge & CHALLENGE_3_ERASER) {
    ++numChallengeSelect;
  }
  return numChallengeSelect <= maxChallengeSelect;
};
