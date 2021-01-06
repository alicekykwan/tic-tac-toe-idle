import { ADD_BASIC_BOARD, PERFORM_TICK } from "../constants/actionTypes";

export function addBasicBoardAction(payload) {
  return { type: ADD_BASIC_BOARD, payload };
}

export function tickAction(payload) {
  return { type: PERFORM_TICK, payload };
}
