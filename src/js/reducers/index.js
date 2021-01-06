import { ADD_BASIC_BOARD, PERFORM_TICK } from "../constants/actionTypes";
import React from "react";
import _ from "lodash";

const boardDimension = 3;

const resetBoard = (board) => {
  board.boardState = new Array(boardDimension*boardDimension).fill('');
  board.currentPlayer = 'X';
  board.winner = '';
  board.winningCells = [];
};

const createNewBoard = () => {
  let board = {};
  resetBoard(board);
  return board;
};

const initialState = {
  boards: [
    createNewBoard(),
    createNewBoard(),
    createNewBoard()],
  coins: {
    amount_x: 0,
    amount_o: 0
  }
};


let getUnusedCells = (board) => {
  let unusedCells = [];
  for (let i = 0; i < boardDimension*boardDimension; i++) {
    if (board[i] === '') {
      unusedCells.push(i);
    }
  }
  // for (let i = 0; i < 3; i++) {
  //     for (let j = 0; j < 3; j++) {
  //         if (board[i][j] === '') {
  //           unusedCells.push(`${i},${j}`);
  //         }
  //     }
  // }
  return unusedCells;
}

let findWinningCells = (board, player) => {
  //check rows
  for (let i = 0; i < boardDimension; i++) {
    let currrow = Array(boardDimension).fill().map((_, idx) =>  i*boardDimension+idx)
    if (currrow.every((element) => board[element] === player) ){
      return currrow;
    }
  }
      // let row = board[i];
      // if (row[0] === row[1] && row[1] === row[2] &&  row[2] === player) {
      //     return [`${i},0`, `${i},1`, `${i},2`];
      // };

  //check columns
  for (let c = 0; c < boardDimension; c++) {
      let currcolumn = Array(boardDimension).fill().map((_, idx) => c + boardDimension*idx)
      if (currcolumn.every((element) => board[element] === player)) {
        return currcolumn
      }
      // if (board[0][c] === board[1][c] && board[1][c] === board[2][c] && board[2][c] === player) {
      //     return [`0,${c}`, `1,${c}`, `2,${c}`];
      // };
  }
  //check diagonals
  let antidiagonal = []
  for (let r = 0; r < boardDimension; r++) {
    antidiagonal.push(r*boardDimension + r)
  }
  if (antidiagonal.every((element) => board[element] === player)) {
    return antidiagonal
  }
  

  let maindiagonal = []
  for (let r = 0; r < boardDimension; r++) {
    maindiagonal.push(r*boardDimension + (boardDimension-r-1))
  }  
  if (maindiagonal.every((element) => board[element] === player)) {
      return maindiagonal
  }
  

  // if (board[0][0] === board[1][1] && board[1][1] === board[2][2] && board[2][2] === player) {
  //     return ['0,0', '1,1', '2,2'];
  // };
  // if (board[2][0] === board[1][1] && board[1][1] === board[0][2] && board[0][2] === player) {
  //     return ['2,0', '1,1', '0,2'];
  // };

  return [];
}

const getBoardWinner = (board) => {
  if (hasPlayerWon(board, 'O')) { return 'O'; }
  if (hasPlayerWon(board, 'X')) { return 'X'; }
  if (getUnusedCells(board) === 0) { return 'TIE'; }
  return '';
}

const hasPlayerWon = (board, player) => {
  //check rows
  for (let i = 0; i < boardDimension; i++) {
    let currrow = Array(boardDimension).fill().map((_, idx) =>  i*boardDimension+idx)
    if (currrow.every((element) => board[element] === player) ){
      return true;
    }
  }

  // for (let i = 0; i < 3; i++) {
  //     let row = board[i];
  //     if (row[0] === row[1] && row[1] === row[2] &&  row[2] === player) {
  //         //setWinningCells([(i, 0), (i,1), (i,2)])
  //         return true;
  //     };
  // }
  //check columns
  for (let c = 0; c < boardDimension; c++) {
    let currcolumn = Array(boardDimension).fill().map((_, idx) => c + boardDimension*idx)
    if (currcolumn.every((element) => board[element] === player)) {
      return true
    }
  }
  // for (let c = 0; c < 3; c++) {
  //     if (board[0][c] === board[1][c] && board[1][c] === board[2][c] && board[2][c] === player) {
  //         //setWinningCells([(0, c), (1, c), (2, c)])
  //         return true;
  //     };
  // }
  //check diagonals
  let antidiagonal = []
  for (let r = 0; r < boardDimension; r++) {
    antidiagonal.push(r*boardDimension + r)
  }
  if (antidiagonal.every((element) => board[element] === player)) {
    return true
  }
  

  let maindiagonal = []
  for (let r = 0; r < boardDimension; r++) {
    maindiagonal.push(r*boardDimension + (boardDimension-r-1))
  }  
  if (maindiagonal.every((element) => board[element] === player)) {
      return true
  }

  // if (board[0][0] === board[1][1] && board[1][1] === board[2][2] && board[2][2] === player) {
  //     //setWinningCells([(0,0), (1,1), (2,2)])
  //     return true;
  // };
  // if (board[2][0] === board[1][1] && board[1][1] === board[0][2] && board[0][2] === player) {
  //     //setWinningCells([(2,0), (1,1), (0,2)])
  //     return true;
  // };

  return false;
}

const doOneMoveOnBoard = (board, coins) => {
  let { currentPlayer, boardState, winner } = board;

  if (winner !== '') {
    resetBoard(board);
    return;
  }

  let unusedCells = getUnusedCells(boardState);
  console.log('unusedcells=', {unusedCells})
  if (unusedCells.length === 0) {
    resetBoard(board);
    return;
  }

  let currcell = unusedCells[Math.floor(Math.random() * unusedCells.length)]
  //let [randR, randC] = unusedCells[Math.floor(Math.random() * unusedCells.length)].split(',');
  boardState[currcell] = currentPlayer;
  board.currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
  board.winner = getBoardWinner(boardState);
  board.winningCells = findWinningCells(boardState, currentPlayer);
  console.log('winningcells', findWinningCells(boardState, currentPlayer))

  if (board.winner === 'X') {
    coins.amount_x += 1;
  } else if (board.winner === 'O') {
    coins.amount_o += 1;
  }
}

const performTicks = (mutableState, numTicks) => {
  for (let i=0; i<numTicks; ++i) {
    mutableState.boards.map((board) => doOneMoveOnBoard(board, mutableState.coins));
    console.log(mutableState.boards)
  }
}

function rootReducer(state = initialState, action) {
  console.log('reducing action: ', action);
  if (action.type === ADD_BASIC_BOARD) {
    return Object.assign({}, state, {
      boards: state.boards.concat([ createNewBoard() ])
    });
  }

  if (action.type === PERFORM_TICK) {
    let newState = _.cloneDeep(state);
    performTicks(newState, 1);
    return newState;
  }

  return state;
}

export default rootReducer;