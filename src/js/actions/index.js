import * as ACTION_TYPE from "../constants/actionTypes";

export function tickAction(payload) {
  return { type: ACTION_TYPE.ACTION_PERFORM_TICK, payload };
}

export function purchaseUpgradeAction(payload){
  return { type: ACTION_TYPE.ACTION_PURCHASE_UPGRADE, payload };
}

export function setInitialMovesAction(payload){
  return { type: ACTION_TYPE.ACTION_SET_INITIAL_MOVES, payload };
}

export function setPausedAction(payload){
  return { type: ACTION_TYPE.ACTION_SET_PAUSED, payload };
}

export function prestigeAction(payload){
  return { type: ACTION_TYPE.ACTION_PRESTIGE, payload };
}

