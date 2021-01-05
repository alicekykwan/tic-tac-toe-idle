import { ADD_BASIC_BOARD, DO_ONE_TICK_FOR_ALL_BOARDS } from "../constants/actionTypes";

export function addBasicBoard(payload) {
  return { type: ADD_BASIC_BOARD, payload };
}

export function doOneTickForAllBoards(payload) {
  return { type: DO_ONE_TICK_FOR_ALL_BOARDS, payload };
}