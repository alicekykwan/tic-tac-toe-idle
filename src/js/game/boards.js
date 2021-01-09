import _ from "lodash";

// TODO: Memoize this
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

const resetBoard = (board, boardSettings) => {
  board.numRows = boardSettings.numRows;
  board.numCols = boardSettings.numCols;
  board.numCells = boardSettings.numRows * boardSettings.numCols;
  board.boardState = new Array(board.numCells).fill('');
  board.winState = new Array(board.numCells).fill(false);
  board.currentPlayer = 'X';
  board.winner = '';
  //board.allMoves = _.shuffle(_.range(board.numCells));
  board.numMovesMade = 0;
  board.winningGroups = computeWinningGroups(boardSettings);

  let used = new Array(board.numCells).fill(false);
  for (let cell of boardSettings.initialMoves) {
    used[cell] = true;
  }
  let remainingMoves = [];
  for (let cell=0; cell<board.numCells; ++cell) {
    if (!used[cell]) {
      remainingMoves.push(cell);
    }
  }
  board.allMoves = boardSettings.initialMoves.concat(_.shuffle(remainingMoves));
};

export const createNewBoard = (boardSettings) => {
  let board = {};
  resetBoard(board, boardSettings);
  return board;
};

let checkWinningGroups = (board) => {
  let player = board.currentPlayer;
  let res = []
  for (let winningGroup of board.winningGroups) {
    if (winningGroup.every((x) => board.boardState[x] === player)) {
      res.push(winningGroup)
    }
  }
  return res;
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

  // Place next move.
  let nextMove = board.allMoves[board.numMovesMade++];
  boardState[nextMove] = currentPlayer;

  // Check winner and award coins.
  let winningGroups = checkWinningGroups(board);
  if (winningGroups.length > 0) {
    board.winner = currentPlayer;
    for (let group of winningGroups) {
      for (let cell of group) {
        board.winState[cell] = true;
      }
    }
    board.winner = currentPlayer;
    let coinsWon = gameSettings.coinsPerWin;
    for (let x = 1; x < winningGroups.length; ++x) {
      coinsWon *= gameSettings.criticalWinMultiplier;
    }
    if (board.winner === 'X') {
      coins.amount_x += coinsWon;
    } else if (board.winner === 'O') {
      coins.amount_o += coinsWon;
    }
  }

  // Switch players
  board.currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
}

export const performOneMove = (mutableState) => {
  mutableState.boards.map((board) => doOneMoveOnBoard(board, mutableState));
}
