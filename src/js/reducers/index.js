import * as ACTION_TYPE from '../constants/actionTypes';
import * as COIN_TYPE from '../constants/coinTypes';
import { UPGRADE_SHOP_O_PICK_INITIAL_MOVES } from '../constants/upgradeTypes';
import { INITIAL_UPGRADES, updateGameSettings, performUpgrade } from '../game/upgrades';
import { recomputeBoardSettingsCache, createNewBoard, performOneMove } from '../game/boards';
import { performPrestige } from '../game/prestige';
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

const initialState = {
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

function rootReducer(state = initialState, action) {
  switch (action.type) {
    case ACTION_TYPE.ACTION_PERFORM_TICK: {
      let tickDuration = 1000 / state.gameSettings.gameSpeed;
      let currTime = Date.now();
      if (state.lastTickTime + tickDuration > currTime) {
        return state;
      }
      let newState = {...state};
      newState.boards = [...newState.boards];
      newState.coins = _.cloneDeep(newState.coins);
      while (newState.boards.length < newState.gameSettings.boardCount) {
        newState.boards.push(createNewBoard(newState.gameSettings.boardSettings));
      }
      if (newState.unlocks.progressLevel === 0 && newState.boards.length >= 9) {
        newState.unlocks = {...newState.unlocks, progressLevel: 1};
      }
      let ticksProcessed = 0;
      while (newState.lastTickTime + tickDuration <= currTime) {
        newState.lastTickTime += tickDuration;
        performOneMove(newState);
        if (++ticksProcessed >= 100) {
          // Only attempt to perform 100 ticks at a time.
          break;
        }
      }
      return newState;
    }

    case ACTION_TYPE.ACTION_PURCHASE_UPGRADE: {
      let {upgradeType, upgradeLevel} = action.payload;
      let mutableState = _.cloneDeep(state);
      performUpgrade(upgradeType, upgradeLevel, mutableState);
      if (mutableState.unlocks.progressLevel === 1 && mutableState.gameSettings.canPrestige) {
        mutableState.unlocks.progressLevel = 2;
      }
      return mutableState;
    }

    case ACTION_TYPE.ACTION_SET_INITIAL_MOVES: {
      let initialMoves = action.payload;
      if (initialMoves.length > state.gameSettings.maxInitialMoves) {
        // Player should not be able to do this normally.
        console.log('Cannot set initial moves to ', initialMoves);
        return state;
      }
      let newBoardSettings = {...state.gameSettings.boardSettings, initialMoves};
      recomputeBoardSettingsCache(newBoardSettings);
      return {...state, gameSettings: {...state.gameSettings, boardSettings: newBoardSettings}};
    }
  
    case ACTION_TYPE.ACTION_SET_PAUSED: {
      let { paused } = action.payload;
      return {...state, paused};
    }
  
    case ACTION_TYPE.ACTION_PRESTIGE: {
      let mutableState = _.cloneDeep(state);
      performPrestige(mutableState);
      return mutableState;
    }

    default:
      console.log('Unknown action type:', action.type);
  }
  return state;
}

export default rootReducer;