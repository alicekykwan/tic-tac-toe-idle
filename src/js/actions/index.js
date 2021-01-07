import { ADD_BASIC_BOARD, PERFORM_TICK, UPDATE_BOARD_SETTINGS } from "../constants/actionTypes";

export function addBasicBoard(payload) {
  return { type: ADD_BASIC_BOARD, payload };
}

export function tickAction(payload) {
  return { type: PERFORM_TICK, payload };
}

export function updateBoardSettingsAction(payload) {
  return { type: UPDATE_BOARD_SETTINGS, payload };
}
