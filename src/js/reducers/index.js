import * as ACTION_TYPE from "../constants/actionTypes";
import { UPGRADE_SHOP_O_PICK_INITIAL_MOVES } from "../constants/upgradeTypes";
import { initialUpgrades, updateGameSettings, performUpgrade } from "../game/upgrades";
import { createNewBoard, performOneMove } from "../game/boards";
import _ from "lodash";

const initialGameSettings = {
  boardSettings: {}
};
updateGameSettings(initialGameSettings, initialUpgrades);

const initialCoins = {
  amount_x: 1000000,
  amount_o: 100000
};

const initialState = {
  upgrades: initialUpgrades,
  gameSettings: initialGameSettings,
  boards: [createNewBoard(initialGameSettings.boardSettings)],
  coins: initialCoins,
  lastTickTime: Date.now(),
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
      console.log('Rejecting initial moves: ', initialMoves);
      return state;
    }
    let newBoardSettings = Object.assign({}, state.gameSettings.boardSettings, {initialMoves: action.payload})
    let newGameSettings = Object.assign({}, state.gameSettings, {boardSettings: newBoardSettings})
    let newState = Object.assign({}, state, {gameSettings: newGameSettings})
    return newState;
  }

  return state;
}

export default rootReducer;