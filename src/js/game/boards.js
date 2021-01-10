import _ from "lodash";

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

  // Determine entire sequence of moves.
  board.allMoves = boardSettings.initialMoves.concat(
      _.shuffle(boardSettings.cache.remainingMoves));
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
        coins.amount_x += coinsWon;
        break;
      case 1:
        coins.amount_o += coinsWon;
        break;
      default:
    }
  }
}

export const performOneMove = (mutableState) => {
  mutableState.boards.map((board) => doOneMoveOnBoard(board, mutableState));
}
