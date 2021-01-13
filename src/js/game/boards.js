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
  board.numMovesAfterWin = 0;
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

const doOneMoveOnBoard = (board, superBoardWon, mutableGameState) => {
  let { coins, gameSettings } = mutableGameState;
  let { boardSettings, winResetDelay } = gameSettings;

  // This board has already won.
  if (board.numMovesMade === board.movesUntilWin) {
    board.numMovesAfterWin += 1;
  }

  // This board resets when: 
  //  1. This board draws/ties, or
  //  2. The superboard containing this board super-wins, or
  //  3. This board won at least winResetDelay moves ago.
  let draw = (board.winner < 0 && board.numMovesMade === board.allMoves.length);
  if (draw || superBoardWon || board.numMovesAfterWin >= winResetDelay) {
    resetBoard(board, boardSettings);
    return;
  }

  if (board.numMovesMade === board.movesUntilWin) {
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
  let { boards, gameSettings, appliedSBSettings, coins } = mutableState;
  let { superBoardSettings, superBoardMaxCount, superCoinsPerWin } = gameSettings;
  if (superBoardSettings.numRows !== appliedSBSettings.numRows ||
      superBoardSettings.numCols !== appliedSBSettings.numCols) {
    appliedSBSettings.numRows = superBoardSettings.numRows;
    appliedSBSettings.numCols = superBoardSettings.numCols;
  }
  let numPlayers = 2;
  let boardsPerSuperBoard = superBoardSettings.numRows * superBoardSettings.numCols;
  let numSuperBoards = Math.min(
    superBoardMaxCount, Math.floor(mutableState.boards.length / boardsPerSuperBoard));
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
    coins[COIN_TYPE.COIN_TYPE_SUPER_X] += superCoinsPerWin * superWins[0];
    mutableState.paused = true;
  }
  if (superWins[1] > 0) {
    coins[COIN_TYPE.COIN_TYPE_SUPER_O] += superCoinsPerWin * superWins[1];
    mutableState.paused = true;
  }
};

export const performOneMove = (mutableState) => {
  if (mutableState.paused) {
    return;
  }
  let { boards, superBoards, appliedSBSettings } = mutableState;
  let numBoardsPerSuperBoard = (appliedSBSettings.numRows * appliedSBSettings.numCols);
  for (let boardIdx=0; boardIdx<boards.length; ++boardIdx) {
    let superBoardIdx = Math.floor(boardIdx / numBoardsPerSuperBoard);
    let superBoardWon = (superBoardIdx < superBoards.length &&
                         superBoards[superBoardIdx].winningGroups.length > 0);
    doOneMoveOnBoard(boards[boardIdx], superBoardWon, mutableState);
  }
  checkSuperWins(mutableState);
}
