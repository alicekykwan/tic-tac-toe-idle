import { ACTION_PERFORM_TICK, ACTION_PURCHASE_UPGRADE } from "../constants/actionTypes";

export function tickAction(payload) {
  return { type: ACTION_PERFORM_TICK, payload };
}

export function purchaseUpgradeAction(payload){
  return { type: ACTION_PURCHASE_UPGRADE, payload };
}
