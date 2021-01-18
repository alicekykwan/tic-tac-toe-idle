import { COIN_TYPE_O, COIN_TYPE_STAR, COIN_TYPE_SUPER_O, COIN_TYPE_SUPER_X, COIN_TYPE_X } from '../constants/coinTypes';
import { createNewBoard } from './boards';
import { IS_UPGRADE_PERMANENT, updateGameSettings } from './upgrades';
import _ from 'lodash';

const COIN_TYPES_TO_RESET = [
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

const resetForPrestige = (mutableState) => {
  // Reset coins and award stars.
  let {coins, spent, upgrades } = mutableState;
  for (let coinType of COIN_TYPES_TO_RESET) {
    let stars = convertCoinsToStars(coinType, coins[coinType] + spent[coinType]);
    coins[coinType] = 0;
    spent[coinType] = 0;
    coins[COIN_TYPE_STAR] += stars;
  }

  // Reset upgrades and recompute game settings.
  for (let upgradeType in upgrades) {
    if (!IS_UPGRADE_PERMANENT[upgradeType]) {
      upgrades[upgradeType] = 0;
    }
  }
  mutableState.gameSettings = {};
  updateGameSettings(mutableState.gameSettings, upgrades);

  // Reset board state.
  mutableState.appliedSBSettings = _.cloneDeep(mutableState.gameSettings.superBoardSettings);
  mutableState.boards = _.range(mutableState.gameSettings.boardCount).map(
      () => createNewBoard(mutableState.gameSettings.boardSettings));
  mutableState.superBoards = [];

  // force re-render
  mutableState.lastTickTime += 1;
};

export const performPrestige = (mutableState) => {
  resetForPrestige(mutableState);
};