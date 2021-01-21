import * as ACTION_TYPE from '../constants/actionTypes';
import { performUpgrade } from '../game/upgrades';
import { recomputeBoardSettingsCache, createNewBoard, performOneMove } from '../game/boards';
import { performPrestige } from '../game/prestige';
import { deserializeGameState, getStateFromLocalStorage, initialState } from '../game/save';
import _ from 'lodash';
import { isValidUserSettings } from '../game/settings';


let lastOffTime = Date.now();

function rootReducer(state, action) {
  if (state === undefined || state === null) {
    let loadedState = getStateFromLocalStorage();
    if (loadedState) {
      let secondsAgo = Math.floor((Date.now() - loadedState.lastTickTime) / 1000);
      console.log(`successfully loaded save data from ${secondsAgo} seconds ago`);
      return loadedState;
    }
    return initialState;
  }

  switch (action.type) {
    case ACTION_TYPE.ACTION_PROCESS_TICKS: {
      let tickDuration = 1000 / state.gameSettings.gameSpeed;
      let currTime = Date.now();
      if (state.lastTickTime > currTime + 1000) {
        return {...state, lastTickTime: currTime};
      }
      if (state.lastTickTime + tickDuration > currTime) {
        return state;
      }
      // Force the fake offline game clock to always be within 2 seconds.
      // Note: this will freeze the game if offlineTickDuration > 2000.
      lastOffTime = Math.max(lastOffTime, currTime - 2000);
      let offlineTickDuration = tickDuration / state.userSettings.maxOfflineSpeed;
      if (lastOffTime + offlineTickDuration > currTime) {
        return state;
      }
      if (state.paused && state.boards.length === state.gameSettings.boardCount) {
        lastOffTime = currTime;
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
      while (newState.lastTickTime + tickDuration <= currTime &&
             lastOffTime + offlineTickDuration <= currTime &&
             Date.now() - currTime <= 10) {
        newState.lastTickTime += tickDuration;
        lastOffTime += offlineTickDuration;
        performOneMove(newState);
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
  
    case ACTION_TYPE.ACTION_TIME_TRAVEL: {
      let {seconds} = action.payload;
      let millis = 1000*seconds;
      if (isNaN(millis)) {
        console.log('invalid duration:', seconds);
        return state;
      }
      return {...state, lastTickTime: state.lastTickTime - millis};
    }

    case ACTION_TYPE.ACTION_IMPORT_SAVE: {
      let loadedState = deserializeGameState(action.payload);
      return loadedState ? loadedState : state;
    }

    case ACTION_TYPE.ACTION_CLEAR_GAME: {
      return {...initialState, lastTickTime: Date.now()};
    }

    case ACTION_TYPE.ACTION_CHANGE_USER_SETTINGS: {
      let newUserSettings = {...state.userSettings, ...action.payload};
      if (isValidUserSettings(newUserSettings)) {
        return {...state, userSettings: newUserSettings};
      }
      console.log('Invalid user settings:', newUserSettings);
      return state;
    }

    case ACTION_TYPE.ACTION_ADD_COINS: {
      let {amt} = action.payload;
      let newCoins = {...state.coins};
      for (let key in newCoins) {
        newCoins[key] += amt;
      }
      return {...state, coins: newCoins};
    }

    default:
      console.log('Unknown action type:', action.type);
  }
  return state;
}

export default rootReducer;