import { COIN_TYPE_O, COIN_TYPE_STAR, COIN_TYPE_SUPER_O, COIN_TYPE_SUPER_X, COIN_TYPE_X, COIN_TYPE_T } from '../constants/coinTypes';
import { createNewBoard } from './boards';
import { IS_UPGRADE_PERMANENT, updateGameSettings } from './upgrades';
import _ from 'lodash';
import { CURRENT_CHALLENGE } from '../constants/upgradeTypes';
import { resetChallengeStats, updateChallengeUnlocks } from './challenges';

export const PRESTIGE_COIN_TYPES = [
  COIN_TYPE_X,
  COIN_TYPE_O,
  COIN_TYPE_SUPER_X,
  COIN_TYPE_SUPER_O,
  COIN_TYPE_T,
];


const SHIFT = {
  [COIN_TYPE_X]: 1000,
  [COIN_TYPE_O]: 1000,
  [COIN_TYPE_SUPER_X]: 1000,
  [COIN_TYPE_SUPER_O]: 1000,
  [COIN_TYPE_T]: 1,
};

const SCALE = {
  [COIN_TYPE_X]: 10,
  [COIN_TYPE_O]: 10,
  [COIN_TYPE_SUPER_X]: 4,
  [COIN_TYPE_SUPER_O]: 4,
  [COIN_TYPE_T]: 2,
};

export const convertCoinsToStars = (coinType, amt) => {
  if (amt < SHIFT[coinType]) {
    return 0;
  }
  let res = Math.log(amt/SHIFT[coinType]) / Math.log(SCALE[coinType]);
  return Math.floor(res);
};

export const convertAllCoinsToStars = (coins, spent) => {
  let stars = 0;
  for (let coinType of PRESTIGE_COIN_TYPES) {
    stars += convertCoinsToStars(coinType, coins[coinType] + spent[coinType]);
  }
  return stars;
}

export const bonusCoinsOnPrestige = (prestigeCount, startBonusMulti) => {
  return {
    [COIN_TYPE_X]: 25 * (prestigeCount + 1) * startBonusMulti,
    [COIN_TYPE_O]: 10 * (prestigeCount + 1) * startBonusMulti,
  };
};

// Requires a mutable copy of state.
export const performPrestige = (state, challenge=-1) => {
  let { canPrestige, startBonusMulti } = state.gameSettings;
  let newState = {
    ...state,
    coins: {...state.coins},
    spent: {...state.spent},
    upgrades: {...state.upgrades},
    stats: {...state.stats},
    challengeStats: {...state.challengeStats},
    unlocks: {...state.unlocks},
  };
  let { coins, spent, upgrades, stats, challengeStats, unlocks } = newState;

  // Reset coins and award stars.
  let totalStars = 0;
  for (let coinType of PRESTIGE_COIN_TYPES) {
    let stars = convertCoinsToStars(coinType, coins[coinType] + spent[coinType]);
    coins[coinType] = 0;
    spent[coinType] = 0;
    if (canPrestige) {
      totalStars += stars;
    }
  }
  coins[COIN_TYPE_STAR] += totalStars;

  let bonusCoins = bonusCoinsOnPrestige(stats.prestigeCount, startBonusMulti);
  for (let coinType in bonusCoins) {
    coins[coinType] += bonusCoins[coinType];
  }

  if (canPrestige) {
    stats.prestigeCount += 1;
  }


  // Reset upgrades and recompute game settings.
  for (let upgradeType in upgrades) {
    if (!IS_UPGRADE_PERMANENT[upgradeType]) {
      upgrades[upgradeType] = 0;
    }
  }

  // if you are in a challenge and is now prestiging with (0) or without (-1) exiting the challenge
  if (upgrades[CURRENT_CHALLENGE] > 0) {
    if (challenge === -1) {
      // Stay within current challenge.
      challengeStats.maxStarsOnPrestige = Math.max(challengeStats.maxStarsOnPrestige, totalStars);
    } else {
      // Exit current challenge.
      updateChallengeUnlocks(unlocks, upgrades[CURRENT_CHALLENGE], challengeStats);
    }
  }

  // Start new challenge.
  if (challenge >= 0) {
    upgrades[CURRENT_CHALLENGE] = challenge;
    resetChallengeStats(challengeStats);
  }

  // Apply upgrades.
  newState.gameSettings = {};
  updateGameSettings(newState.gameSettings, upgrades);
  let { superBoardSettings, boardCount, boardSettings } = newState.gameSettings;

  // Reset board state.
  newState.appliedSBSettings = _.cloneDeep(superBoardSettings);
  newState.boards = _.range(boardCount).map(() => createNewBoard(boardSettings));
  newState.superBoards = [];

  // force re-render
  newState.lastTickTime += 1;

  return newState;
};
