export const CHALLENGE_1_SQUARE = 1;
export const CHALLENGE_2_FULLBOARD = 2;
export const CHALLENGE_3_CHAOS = 4;

export const renderChallenge = (challenge) => {
  switch (challenge) {
    case 0:
      return 'No Challenge Active';
    case CHALLENGE_1_SQUARE:
      return 'Challenge I Active';
    case CHALLENGE_2_FULLBOARD:
      return 'Challenge II Active';
    case CHALLENGE_3_CHAOS:
      return 'Challenge III Active';
    default:
      return `Challenge ${challenge} active`;
  }
};

export const renderChallengeRules = (challenge) => {
  switch (challenge) {
    case 0:
      return 'No special rules.';
    case CHALLENGE_1_SQUARE:
      return 'Can only win with a 2x2 square.';
    case CHALLENGE_2_FULLBOARD:
      return 'Only wins that fill a board or super-board grant rewards.';
    case CHALLENGE_3_CHAOS:
      return 'Players can remove pieces at random.';
    default:
      return `Unknown challenge: ${challenge}.`;
  }
};
