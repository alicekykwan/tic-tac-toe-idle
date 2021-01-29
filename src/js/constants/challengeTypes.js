// Challenge Types
export const CHALLENGE_1_SQUARE = 1;
export const CHALLENGE_2_FULLBOARD = 2;
export const CHALLENGE_3_ERASER = 4;

export const INDIVIDUAL_CHALLENGES = [
  CHALLENGE_1_SQUARE,
  CHALLENGE_2_FULLBOARD,
  CHALLENGE_3_ERASER,
];

// Unlocks associated with challenges
export const UNLOCK_UPGRDADE_SQUARE = 'uus';
export const UNLOCK_UPGRDADE_FULL = 'uuf';
export const UNLOCK_UPGRDADE_3P = 'uu3';

export const INITIAL_CHALLENGE_UNLOCKS = {
  [UNLOCK_UPGRDADE_SQUARE]: false,
  [UNLOCK_UPGRDADE_FULL]: false,
  [UNLOCK_UPGRDADE_3P]: false,
};
