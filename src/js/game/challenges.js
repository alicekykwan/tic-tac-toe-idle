import { CHALLENGE_1_SQUARE, CHALLENGE_2_FULLBOARD, CHALLENGE_3_ERASER, UNLOCK_UPGRDADE_SQUARE, UNLOCK_UPGRDADE_FULL, UNLOCK_UPGRDADE_3P } from '../constants/challengeTypes';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ArrowRightRoundedIcon from '@material-ui/icons/ArrowRightRounded';
import DoneIcon from '@material-ui/icons/Done';

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

export const renderChallengeGoals = (challenge) => {
  return (
    <List>
      <ListItem>
        <ListItemIcon children={bullet} />
        <ListItemText>Prestige.</ListItemText>
      </ListItem>
    </List>
  );
};

const getRewardsForChallenge = (challenge) => {
  let res = [];
  if (challenge & CHALLENGE_1_SQUARE) {
    res.push(UNLOCK_UPGRDADE_SQUARE);
  }
  if (challenge & CHALLENGE_2_FULLBOARD) {
    res.push(UNLOCK_UPGRDADE_FULL);
  }
  if (challenge & CHALLENGE_3_ERASER) {
    res.push(UNLOCK_UPGRDADE_3P);
  }
  return res;
};

const getRewardDescription = (reward) => {
  // TODO format coins
  switch (reward) {
    case UNLOCK_UPGRDADE_SQUARE:
      return 'Unlock an O-shop upgrade that allows winning by forming 2x2 squares (in addition to lines).';
    case UNLOCK_UPGRDADE_FULL:
      return 'Unlock an X shop upgrade that increases rewards for each extra move taken.';
    case UNLOCK_UPGRDADE_3P:
      return 'Unlock a super-O shop upgrade to add a third player.';
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
