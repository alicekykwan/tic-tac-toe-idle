import { ADD_BASIC_BOARD, PERFORM_TICK, UPDATE_BOARD_SETTINGS } from "../constants/actionTypes";
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

const initialCoins = {
  amount_x: 0,
  amount_o: 0
}

const initialState = {
  boardSettings: initialBoardSettings,
  boards: [
    createNewBoard(initialBoardSettings),
    createNewBoard(initialBoardSettings),
    createNewBoard(initialBoardSettings)],
  coins: initialCoins,
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
  let { coins, boardSettings } = mutableGameState;
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
      coins.amount_x += 1;
    } else if (board.winner === 'O') {
      coins.amount_o += 1;
    }
  }
  board.currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
}

const performTicks = (mutableState, numTicks) => {
  // Step 1: Reconcile boardSettings and gameSettings with upgrades.
  for (let i=0; i<numTicks; ++i) {
    // Step 2: Perform moves on boards based on boardSettings and gameSettings.
    mutableState.boards.map((board) => doOneMoveOnBoard(board, mutableState));
    // Step 3: Propagate board wins to super-boards based on boardSettings and gameSettings.
  }
}

function rootReducer(state = initialState, action) {
  if (action.type === ADD_BASIC_BOARD) {
    return Object.assign({}, state, {
      boards: state.boards.concat([ createNewBoard(state.boardSettings) ])
    });
  }

  if (action.type === PERFORM_TICK) {
    let mutableState = _.cloneDeep(state);
    performTicks(mutableState, 1);
    return mutableState;
  }

  if (action.type === UPDATE_BOARD_SETTINGS) {
    return Object.assign({}, state, {
      boardSettings: Object.assign({}, state.boardSettings, action.payload)
    });
  }

  return state;
}

export default rootReducer;