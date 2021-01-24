import { COIN_TYPE_O, COIN_TYPE_STAR, COIN_TYPE_SUPER_O, COIN_TYPE_SUPER_X, COIN_TYPE_X } from '../constants/coinTypes';
import { createNewBoard } from './boards';
import { IS_UPGRADE_PERMANENT, updateGameSettings } from './upgrades';
import _ from 'lodash';

export const PRESTIGE_COIN_TYPES = [
  COIN_TYPE_X,
  COIN_TYPE_O,
  COIN_TYPE_SUPER_X,
  COIN_TYPE_SUPER_O
];

const SHIFT = {
  [COIN_TYPE_X]: 1000,
  [COIN_TYPE_O]: 1000,
  [COIN_TYPE_SUPER_X]: 1000,
  [COIN_TYPE_SUPER_O]: 1000,
};

const SCALE = {
  [COIN_TYPE_X]: 10,
  [COIN_TYPE_O]: 10,
  [COIN_TYPE_SUPER_X]: 4,
  [COIN_TYPE_SUPER_O]: 4,
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
const resetForPrestige = (mutableState) => {
  // Reset coins and award stars.
  let { coins, spent, upgrades, stats } = mutableState;
  let { canPrestige, startBonusMulti } = mutableState.gameSettings;

  for (let coinType of PRESTIGE_COIN_TYPES) {
    let stars = convertCoinsToStars(coinType, coins[coinType] + spent[coinType]);
    coins[coinType] = 0;
    spent[coinType] = 0;
    if (canPrestige) {
      coins[COIN_TYPE_STAR] += stars;
    }
  }

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
  mutableState.gameSettings = {};
  updateGameSettings(mutableState.gameSettings, upgrades);
  let { superBoardSettings, boardCount, boardSettings } = mutableState.gameSettings;

  // Reset board state.
  mutableState.appliedSBSettings = _.cloneDeep(superBoardSettings);
  mutableState.boards = _.range(boardCount).map(() => createNewBoard(boardSettings));
  mutableState.superBoards = [];

  // force re-render
  mutableState.lastTickTime += 1;
};

export const performPrestige = (mutableState) => {
  resetForPrestige(mutableState);
};