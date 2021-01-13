import * as COIN_TYPE from '../constants/coinTypes';
import _ from 'lodash';

const computeWinningGroups = (boardSettings) => {
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

const computeRemainingMoves = (boardSettings) => {
  let { numRows, numCols, initialMoves } = boardSettings;
  let numCells = numRows * numCols;
  let used = new Array(numCells).fill(false);
  for (let cell of initialMoves) {
    used[cell] = true;
  }
  let remainingMoves = [];
  for (let cell=0; cell<numCells; ++cell) {
    if (!used[cell]) {
      remainingMoves.push(cell);
    }
  }
  return remainingMoves;
}

export const recomputeBoardSettingsCache = (mutableBoardSettings) => {
  mutableBoardSettings.cache = {
    winningGroups: computeWinningGroups(mutableBoardSettings),
    remainingMoves: computeRemainingMoves(mutableBoardSettings),
  };
};


const resetBoard = (board, boardSettings) => {
  board.numRows = boardSettings.numRows;
  board.numCols = boardSettings.numCols;
  let numPlayers = 2;
  board.numPlayers = numPlayers;
  board.numMovesMade = 0;
  board.id = Math.random();

  // Determine entire sequence of moves.
  board.allMoves = boardSettings.initialMoves.concat(
      _.shuffle(boardSettings.cache.remainingMoves));

  // t[x] is the move sequence number that fills cell x
  let numCells = board.numRows * board.numCols;
  let t = new Array(numCells).fill(-1);
  for (let i=0; i<board.allMoves.length; ++i) {
    t[board.allMoves[i]] = i;
  }

  // Determine the winner from sequence of moves.
  board.movesUntilWin = numCells + 1;
  board.winningGroups = [];
  board.winner = -1;  // redundant, but helpful
  for (let winningGroup of boardSettings.cache.winningGroups) {
    let player = t[winningGroup[0]] % numPlayers;
    let good = true;
    let last = 0;
    for (let move of winningGroup) {
      if (t[move] < 0 || t[move] % numPlayers !== player) {
        good = false;
        break;
      }
      last = Math.max(last, t[move] + 1);
    }
    if (!good || last > board.movesUntilWin) {
      continue;
    }
    if (last < board.movesUntilWin) {
      board.movesUntilWin = last;
      board.winningGroups = [];
      board.winner = player;
    }
    if (last === board.movesUntilWin) {
      board.winningGroups.push(winningGroup);
    }
  }
};

export const createNewBoard = (boardSettings) => {
  let board = {};
  resetBoard(board, boardSettings);
  return board;
};

const doOneMoveOnBoard = (board, mutableGameState) => {
  let { coins, gameSettings } = mutableGameState;
  let { boardSettings } = gameSettings

  if (board.numMovesMade === board.movesUntilWin) {
    // Has winner.
    resetBoard(board, boardSettings);
    return;
  }

  if (board.numMovesMade === board.allMoves.length) {
    // Draw.
    resetBoard(board, boardSettings);
    return;
  }

  // Progress the next move.
  board.numMovesMade += 1;

  // Check winner and award coins.
  if (board.numMovesMade === board.movesUntilWin) {
    let coinsWon = gameSettings.coinsPerWin;
    for (let x = 1; x < board.winningGroups.length; ++x) {
      coinsWon *= gameSettings.criticalWinMultiplier;
    }
    switch (board.winner) {
      case 0:
        coins[COIN_TYPE.COIN_TYPE_X] += coinsWon;
        break;
      case 1:
        coins[COIN_TYPE.COIN_TYPE_O] += coinsWon;
        break;
      default:
    }
  }
};

const checkSuperWins = (mutableState) => {
  let { boards, gameSettings, coins } = mutableState;
  let { superBoardSettings } = gameSettings;
  let numPlayers = 2;
  let boardsPerSuperBoard = superBoardSettings.numRows * superBoardSettings.numCols;
  let maxNumSuperBoards = 1;
  let numSuperBoards = Math.min(
    maxNumSuperBoards, Math.floor(mutableState.boards.length / boardsPerSuperBoard));
  let superWins = new Array(numPlayers).fill(0);
  let superBoards = [];

  // Iterate over all super boards.
  for (let superBoardIdx=0; superBoardIdx<numSuperBoards; ++superBoardIdx) {
    // Compute current state of the super board.
    let superBoardCellState = new Array(boardsPerSuperBoard).fill(-1)
    for (let i=0; i<9; i++) {
      let board = boards[superBoardIdx*boardsPerSuperBoard+i];
      if (board.numMovesMade === board.movesUntilWin) {
        superBoardCellState[i] = board.winner;
      }
    }

    // Look for winners on the computed super board.
    // TODO: cache winning groups within superBoardSettings.cache
    let winningGroups = [];
    let superBoardWinningGroups = computeWinningGroups(mutableState.gameSettings.superBoardSettings);
    for (let winningGroup of superBoardWinningGroups) {
      let winner = superBoardCellState[winningGroup[0]];
      if (winner < 0) {
        continue;
      }
      if (winningGroup.every((cell) => (superBoardCellState[cell] === winner))) {
        superWins[winner] += 1;
        winningGroups.push(winningGroup);
        // TODO: Detect critical super-wins.
      }
    }

    superBoards.push({
      winningGroups: winningGroups,
    });
  }
  mutableState.superBoards = superBoards;

  if (superWins[0] > 0) {
    coins[COIN_TYPE.COIN_TYPE_SUPER_X] += superWins[0];
    mutableState.paused = true;
  }
  if (superWins[1] > 0) {
    coins[COIN_TYPE.COIN_TYPE_SUPER_O] += superWins[1];
    mutableState.paused = true;
  }
};

export const performOneMove = (mutableState) => {
  if (mutableState.paused) {
    return;
  }
  // TODO: flag all boards within a winning super-board for reset.
  mutableState.boards.map((board) => doOneMoveOnBoard(board, mutableState));
  checkSuperWins(mutableState);
}
