import * as ACTION_TYPE from "../constants/actionTypes";
import * as COIN_TYPE from "../constants/coinTypes";
import { UPGRADE_SHOP_O_PICK_INITIAL_MOVES } from "../constants/upgradeTypes";
import { initialUpgrades, updateGameSettings, performUpgrade } from "../game/upgrades";
import { recomputeBoardSettingsCache, createNewBoard, performOneMove } from "../game/boards";
import _ from "lodash";

const initialGameSettings = {
  boardSettings: {},
  superBoardSettings: {
    numRows: 3,
    numCols: 3,
  },
};
updateGameSettings(initialGameSettings, initialUpgrades);

const initialCoins = {
  [COIN_TYPE.COIN_TYPE_X]: 100000000,
  [COIN_TYPE.COIN_TYPE_O]: 100000000,
  [COIN_TYPE.COIN_TYPE_SUPER_X]: 100000000,
  [COIN_TYPE.COIN_TYPE_SUPER_O]: 100000000,
};

const initialUnlocks = {
  // progressLevel | super shops | star shop | triangle shops
  // --------------+-------------+-----------+-----------------
  // 0             | hidden      | hidden    | hidden
  // 1             | shown       | hidden    | hidden
  // 2             | shown       | shown     | hidden
  // 3             | shown       | shown     | shown
  progressLevel: 0,
};

const initialState = {
  upgrades: initialUpgrades,
  unlocks: initialUnlocks,
  gameSettings: initialGameSettings,
  boards: [createNewBoard(initialGameSettings.boardSettings)],
  superBoards: [],
  coins: initialCoins,
  lastTickTime: Date.now(),
  paused: false,
  version: 1
};

function rootReducer(state = initialState, action) {
  if (action.type === ACTION_TYPE.ACTION_PERFORM_TICK) {
    let tickDuration = 1000 / state.gameSettings.gameSpeed;
    let currTime = Date.now();
    if (state.lastTickTime + tickDuration > currTime) {
      return state;
    }
    let mutableState = _.cloneDeep(state);
    while (mutableState.boards.length < mutableState.gameSettings.boardCount) {
      mutableState.boards.push(createNewBoard(mutableState.gameSettings.boardSettings));
    }
    if (mutableState.unlocks.progressLevel === 0 && mutableState.boards.length >= 9) {
      mutableState.unlocks.progressLevel = 1;
    }
    let ticksProcessed = 0;
    while (mutableState.lastTickTime + tickDuration <= currTime) {
      mutableState.lastTickTime += tickDuration;
      performOneMove(mutableState);
      if (++ticksProcessed >= 100) {
        // Only attempt to perform 100 ticks at a time.
        break;
      }
    }
    return mutableState;
  }

  if (action.type === ACTION_TYPE.ACTION_PURCHASE_UPGRADE) {
    let {upgradeType, upgradeLevel} = action.payload;
    let mutableState = _.cloneDeep(state);
    performUpgrade(upgradeType, upgradeLevel, mutableState);
    return mutableState;
  }

  if (action.type === ACTION_TYPE.ACTION_SET_INITIAL_MOVES) {
    let initialMoves = action.payload;
    if (initialMoves.length > state.upgrades[UPGRADE_SHOP_O_PICK_INITIAL_MOVES]) {
      // Player should not be able to do this normally.
      console.log('Cannot set initial moves to ', initialMoves);
      return state;
    }
    let newBoardSettings = Object.assign({}, state.gameSettings.boardSettings, {initialMoves: action.payload});
    recomputeBoardSettingsCache(newBoardSettings);
    let newGameSettings = Object.assign({}, state.gameSettings, {boardSettings: newBoardSettings});
    let newState = Object.assign({}, state, {gameSettings: newGameSettings});
    return newState;
  }

  if (action.type === ACTION_TYPE.ACTION_SET_PAUSED) {
    let { paused } = action.payload;
    return Object.assign({}, state, {paused});
  }

  return state;
}

export default rootReducer;