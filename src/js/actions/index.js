import * as ACTION_TYPE from "../constants/actionTypes";

export function processTicksAction(payload) {
  return { type: ACTION_TYPE.ACTION_PROCESS_TICKS, payload };
}

export function purchaseUpgradeAction(payload) {
  return { type: ACTION_TYPE.ACTION_PURCHASE_UPGRADE, payload };
}

export function setInitialMovesAction(payload) {
  return { type: ACTION_TYPE.ACTION_SET_INITIAL_MOVES, payload };
}

export function setPausedAction(payload) {
  return { type: ACTION_TYPE.ACTION_SET_PAUSED, payload };
}

export function prestigeAction(payload) {
  return { type: ACTION_TYPE.ACTION_PRESTIGE, payload };
}

export function timeTravelAction(payload) {
  return { type: ACTION_TYPE.ACTION_TIME_TRAVEL, payload };
}

export function importSaveAction(payload) {
  return { type: ACTION_TYPE.ACTION_IMPORT_SAVE, payload };
}

export function clearGameAction(payload) {
  return { type: ACTION_TYPE.ACTION_CLEAR_GAME, payload };
}

export function changeUserSettingsAction(payload) {
  return { type: ACTION_TYPE.ACTION_CHANGE_USER_SETTINGS, payload };
}

export function addCoinsAction(payload) {
  return { type: ACTION_TYPE.ACTION_ADD_COINS, payload };
}

export function startChallengeAction(payload) {
  return { type: ACTION_TYPE.ACTION_START_CHALLENGE, payload };
}
