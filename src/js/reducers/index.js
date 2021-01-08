import { ACTION_PERFORM_TICK, ACTION_PURCHASE_UPGRADE } from "../constants/actionTypes";
import { initialUpgrades, performUpgrade } from "../game/upgrades";
import React from "react";
import _ from "lodash";

// TODO: Memoize this
const findWinningGroups = (boardSettings) => {
  let winningGroups = [];

  //check rows
  for (let i = 0; i < boardSettings.numRows; i++) {
    let currrow = _.range(i*boardSettings.numCols, (i+1)*boardSettings.numCols);
    winningGroups.push(currrow);
  }

  //check columns
  let numCells = boardSettings.numRows * boardSettings.numCols;
  for (let c = 0; c < boardSettings.numCols; c++) {
    let currcolumn = _.range(c, numCells, boardSettings.numCols);
    winningGroups.push(currcolumn);
  }

  //check diagonals
  if (boardSettings.numRows === boardSettings.numCols) {
    // TODO: Generalize
    let antidiagonal = []
    for (let r = 0; r < boardSettings.numRows; r++) {
      antidiagonal.push(r*boardSettings.numRows + r)
    }
    winningGroups.push(antidiagonal);

    let maindiagonal = []
    for (let r = 0; r < boardSettings.numRows; r++) {
      maindiagonal.push(r*boardSettings.numRows + (boardSettings.numRows-r-1))
    }  
    winningGroups.push(maindiagonal);
  }

  return winningGroups;
};

const resetBoard = (board, boardSettings) => {
  board.numRows = boardSettings.numRows;
  board.numCols = boardSettings.numCols;
  board.numCells = boardSettings.numRows * boardSettings.numCols;
  board.boardState = new Array(board.numCells).fill('');
  board.currentPlayer = 'X';
  board.winner = '';
  board.winningCells = [];
  board.allMoves = _.shuffle(_.range(board.numCells));
  board.numMovesMade = 0;
  board.winningGroups = findWinningGroups(boardSettings);
};

const createNewBoard = (boardSettings) => {
  let board = {};
  resetBoard(board, boardSettings);
  return board;
};

const initialBoardSettings = {
  numRows: 3,
  numCols: 3
};

const initialGameSettings = {
  gameSpeed: 1,
  boardCount: 1,
  coinsPerWin: 1,
  boardSettings: initialBoardSettings
};

const initialCoins = {
  amount_x: 1000000,
  amount_o: 0
};

const initialState = {
  upgrades: initialUpgrades,
  gameSettings: initialGameSettings,
  boards: [createNewBoard(initialGameSettings.boardSettings)],
  coins: initialCoins,
  lastTickTime: Date.now(),
  version: 1
};


let findWinningCells = (board) => {
  let player = board.currentPlayer;
  for (let winningGroup of board.winningGroups) {
    if (winningGroup.every((x) => board.boardState[x] === player)) {
      // TODO: append to a;
      return winningGroup;
    }
  }
  return [];
}

const doOneMoveOnBoard = (board, mutableGameState) => {
  let { coins, gameSettings } = mutableGameState;
  let { boardSettings } = gameSettings
  let { currentPlayer, boardState, winner } = board;

  if (winner !== '') {
    // Already has winner.
    resetBoard(board, boardSettings);
    return;
  }

  if (board.numMovesMade === board.allMoves.length) {
    // Draw.
    resetBoard(board, boardSettings);
    return;
  }

  let nextMove = board.allMoves[board.numMovesMade++];
  boardState[nextMove] = currentPlayer;
  board.winningCells = findWinningCells(board);
  if (board.winningCells.length > 0) {
    board.winner = currentPlayer;
    if (board.winner === 'X') {
      coins.amount_x += gameSettings.coinsPerWin;
    } else if (board.winner === 'O') {
      coins.amount_o += gameSettings.coinsPerWin;
    }
  }
  board.currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
}

const performOneMove = (mutableState) => {
  mutableState.boards.map((board) => doOneMoveOnBoard(board, mutableState));
}

function rootReducer(state = initialState, action) {
  if (action.type === ACTION_PURCHASE_UPGRADE) {
    let {upgradeType, upgradeLevel} = action.payload;
    let mutableState = _.cloneDeep(state);
    performUpgrade(upgradeType, upgradeLevel, mutableState);
    return mutableState;
  }

  if (action.type === ACTION_PERFORM_TICK) {
    let tickDuration = 2000 / state.gameSettings.gameSpeed;
    let currTime = Date.now();
    if (state.lastTickTime + tickDuration > currTime) {
      return state;
    }
    let mutableState = _.cloneDeep(state);
    while (mutableState.boards.length < mutableState.gameSettings.boardCount) {
      mutableState.boards.push(createNewBoard(mutableState.gameSettings.boardSettings));
    }
    // TODO: Also add a cap.
    while (mutableState.lastTickTime + tickDuration <= currTime) {
      mutableState.lastTickTime += tickDuration;
      performOneMove(mutableState);
    }
    return mutableState;
  }

  return state;
}

export default rootReducer;