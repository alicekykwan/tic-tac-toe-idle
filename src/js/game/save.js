import * as COIN_TYPE from '../constants/coinTypes';
import { INITIAL_UPGRADES, updateGameSettings } from '../game/upgrades';
import { createNewBoard } from '../game/boards';
import store from "../store/index";
import _ from 'lodash';

const initialGameSettings = {};
updateGameSettings(initialGameSettings, INITIAL_UPGRADES);

const initialCoins = {
  [COIN_TYPE.COIN_TYPE_X]: 100000000,
  [COIN_TYPE.COIN_TYPE_O]: 100000000,
  [COIN_TYPE.COIN_TYPE_SUPER_X]: 100000000,
  [COIN_TYPE.COIN_TYPE_SUPER_O]: 100000000,
  [COIN_TYPE.COIN_TYPE_STAR]: 0,
};

const initialSpent = {
  [COIN_TYPE.COIN_TYPE_X]: 0,
  [COIN_TYPE.COIN_TYPE_O]: 0,
  [COIN_TYPE.COIN_TYPE_SUPER_X]: 0,
  [COIN_TYPE.COIN_TYPE_SUPER_O]: 0,
  [COIN_TYPE.COIN_TYPE_STAR]: 0,
};

const initialUnlocks = {
  // progressLevel | super shops | star shop | challenges | triangle shop
  // --------------+-------------+-----------+------------+---------------
  // 0             | hidden      | hidden    | hidden     | hidden
  // 1             | shown       | hidden    | hidden     | hidden
  // 2             | shown       | shown     | hidden     | hidden
  // 3             | shown       | shown     | shown      | shown
  progressLevel: 0,
};

export const initialState = {
  upgrades: INITIAL_UPGRADES,
  unlocks: initialUnlocks,
  gameSettings: initialGameSettings,
  boards: _.range(initialGameSettings.boardCount).map(
      () => createNewBoard(initialGameSettings.boardSettings)),
  appliedSBSettings: _.cloneDeep(initialGameSettings.superBoardSettings),
  superBoards: [],
  coins: initialCoins,
  spent: initialSpent,
  lastTickTime: Date.now(),
  paused: false,
  version: 1
};

const isValidGameState = (state) => {
  if (!state.hasOwnProperty('lastTickTime')) {
    return false;
  }
  return true;
}

export const deserializeGameState = (encoded) => {
  if (!encoded) {
    return null;
  }
  try {
    let decoded = atob(encoded);
    let state = JSON.parse(decoded);
    // Put data migrations here.
    if (!isValidGameState(state)) {
      console.log('Invalid game state:', state);
      return null;
    }
    return state;
  } catch (e) {
    console.log(e);
    return null;
  }
};

export const serializeCurrentGameState = () => {
  let json = JSON.stringify(store.getState());
  let encoded = btoa(json);
  return encoded;
};

const LOCAL_STORAGE_KEY = 'tictactoeidle';

export const getStateFromLocalStorage = () => {
  let encoded = window.localStorage.getItem(LOCAL_STORAGE_KEY);
  if (!encoded) {
    return null;
  }
  let loadedState = deserializeGameState(encoded);
  if (!loadedState) {
    console.log('Failed to load localStorage save data:', encoded);
  }
  return loadedState;
};

export const saveCurrentStateToLocalStorage = () => {
  window.localStorage.setItem(LOCAL_STORAGE_KEY, serializeCurrentGameState());
};
