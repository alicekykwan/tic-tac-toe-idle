import * as COIN_TYPE from '../constants/coinTypes';
import _ from 'lodash';

const computeWinningGroups = (boardSettings) => {
  let { numRows, numCols, lineWin, squareWin } = boardSettings;
  let winningGroups = [];

  if (lineWin > 0) {
    // rows
    for (let i = 0; i < numRows; ++i) {
      for (let j = 0; j <= numCols - lineWin; ++j) {
        let cell = i*numCols+j;
        winningGroups.push(_.range(cell, cell+lineWin));
      }
    }
    // columns
    for (let i = 0; i <= numRows - lineWin; ++i) {
      for (let j = 0; j < numCols; ++j) {
        let cell = i*numCols+j;
        winningGroups.push(_.range(cell, cell+lineWin*numCols, numCols));
      }
    }
    // diagonals
    for (let i = 0; i <= numRows - lineWin; ++i) {
      for (let j = 0; j <= numCols - lineWin; ++j) {
        let cell = i*numCols+j;
        winningGroups.push(_.range(cell, cell+lineWin*(numCols+1), numCols+1));
      }
    }
    // anti-diagonals
    for (let i = 0; i <= numRows - lineWin; ++i) {
      for (let j = lineWin - 1; j < numCols; ++j) {
        let cell = i*numCols+j;
        winningGroups.push(_.range(cell, cell+lineWin*(numCols-1), numCols-1));
      }
    }
  }

  if (squareWin > 0) {
    for (let i = 0; i <= numRows - squareWin; ++i) {
      for (let j = 0; j <= numCols - squareWin; ++j) {
        let cell = i*numCols+j;
        let winningGroup = [];
        for (let k = 0; k < squareWin - 1; ++k) {
          winningGroup.push(cell);
          cell += 1;
        }
        for (let k = 0; k < squareWin - 1; ++k) {
          winningGroup.push(cell);
          cell += numCols;
        }
        for (let k = 0; k < squareWin - 1; ++k) {
          winningGroup.push(cell);
          cell -= 1;
        }
        for (let k = 0; k < squareWin - 1; ++k) {
          winningGroup.push(cell);
          cell -= numCols;
        }
        winningGroups.push(winningGroup);
      }
    }
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
};

export const recomputeBoardSettingsCache = (mutableBoardSettings) => {
  mutableBoardSettings.cache = {
    winningGroups: computeWinningGroups(mutableBoardSettings),
    remainingMoves: computeRemainingMoves(mutableBoardSettings),
  };
  let numCells = mutableBoardSettings.numRows * mutableBoardSettings.numCols;
  let groupsWithCell = [];
  for (let i=0; i<numCells; ++i) {
    groupsWithCell.push([]);
  }
  for (let [groupIdx, group] of mutableBoardSettings.cache.winningGroups.entries()) {
    for (let cell of group) {
      groupsWithCell[cell].push(groupIdx);
    }
  }
  mutableBoardSettings.cache.groupsWithCell = groupsWithCell;
};

export const recomputeSuperBoardSettingsCache = (mutableSuperBoardSettings) => {
  mutableSuperBoardSettings.cache = {
    winningGroups: computeWinningGroups(mutableSuperBoardSettings),
  };
};

const simulateMoves = (board, boardSettings, state) => {
  let { winningGroups, groupsWithCell }= boardSettings.cache;
  board.numMovesMade = 0;
  board.numMovesAfterWin = 0;
  board.movesUntilWin = 0;
  board.winningGroups = [];
  board.winner = -1;
  board.erase = [];
  let player = board.startPlayer;
  let count = [];
  for (let i=0; i<board.numPlayers; ++i) {
    count.push(new Array(winningGroups.length).fill(0));
  }
  for (let [cell, val] of state.entries()) {
    if (val >= 0) {
      for (let groupId of groupsWithCell[cell]) {
        if (++count[val][groupId] === winningGroups[groupId].length) {
          board.winningGroups.push(winningGroups[groupId]);
          board.winner = val;
        }
      }
    }
  }
  for (let cell of board.allMoves) {
    if (board.winner !== -1) {
      break;
    }
    ++board.movesUntilWin;
    if (state[cell] === -1) {
      // Place piece.
      board.erase.push(false);
      state[cell] = player;
      for (let groupId of groupsWithCell[cell]) {
        if (++count[player][groupId] === winningGroups[groupId].length) {
          board.winningGroups.push(winningGroups[groupId]);
          board.winner = player;
        }
      }
    } else {
      // Erase piece.
      board.erase.push(true);
      for (let groupId of groupsWithCell[cell]) {
        --count[state[cell]][groupId];
      }
      state[cell] = -1;
    }
    if (++player === board.numPlayers) {
      player = 0;
    }
  }
  if (board.winner === -1) {
    board.movesUntilWin = board.allMoves.length + 1;
    board.endState = state;
  } else {
    board.emptyWin = (boardSettings.requireFull && _.min(state) >= 0);
    board.allMoves.splice(board.movesUntilWin);
  }
}

const resetBoard = (board, boardSettings) => {
  let { remainingMoves }= boardSettings.cache;
  board.numRows = boardSettings.numRows;
  board.numCols = boardSettings.numCols;
  board.numPlayers = 2;
  board.startPlayer = 0;
  board.id = Math.random();

  // Determine entire sequence of moves.
  let numCells = board.numRows * board.numCols;
  if (boardSettings.allowErase) {
    board.allMoves = [...boardSettings.initialMoves];
    while (board.allMoves.length < numCells) {
      board.allMoves.push(_.random(0, numCells-1));
    }
  } else {
    board.allMoves = boardSettings.initialMoves.concat(_.shuffle(remainingMoves));
  }

  // Determine the winner from sequence of moves.
  delete board.startState;
  delete board.prevId;
  simulateMoves(board, boardSettings, new Array(numCells).fill(-1));
};

const extendBoard = (board, boardSettings) => {
  board.startPlayer += board.allMoves.length;
  board.startPlayer %= board.numPlayers;
  board.numPlayers = 2;
  board.startState = board.endState;
  board.prevId = board.id;
  board.id = Math.random();
  simulateMoves(board, boardSettings, [...board.endState]);
};

export const createNewBoard = (boardSettings) => {
  let board = {};
  resetBoard(board, boardSettings);
  return board;
};

const computeNextBoard = (board, superBoardWon, gameSettings, coins) => {
  let { boardSettings, winResetDelay } = gameSettings;
  board = {...board};

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
    return board;
  }

  if (board.numMovesMade === board.movesUntilWin) {
    return board;
  }

  // Progress the next move.
  board.numMovesMade += 1;

  if (boardSettings.allowErase && board.winner < 0 && board.numMovesMade === board.allMoves.length) {
    // If erasing is alowed, then we have to regenerate to avoid draw.
    extendBoard(board, boardSettings);
    return board;
  }

  // Check winner and award coins.
  if (board.numMovesMade === board.movesUntilWin && !board.emptyWin) {
    let coinsWon = gameSettings.coinsPerWin * board.winningGroups.length;
    if (board.winningGroups.length > 1) {
      coinsWon *= gameSettings.criticalWinMult;
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
  return board;
};

const updateSuperBoards = (newState) => {
  let { boards, gameSettings, appliedSBSettings, coins } = newState;
  let { superBoardSettings, superBoardMaxCount, superCoinsPerWin, criticalSuperWinMult } = gameSettings;
  let { numRows, numCols, cache, requireFull } = superBoardSettings;
  let numPlayers = 2;

  // On resize we must reset all super-boards.
  let superBoards = [];
  if (numRows !== appliedSBSettings.numRows ||
      numCols !== appliedSBSettings.numCols) {
    newState.appliedSBSettings = {...appliedSBSettings, numRows, numCols};
  } else {
    superBoards = [...newState.superBoards];
  }

  // Create missing super boards.
  let boardsPerSuperBoard = superBoardSettings.numRows * superBoardSettings.numCols;
  let numSuperBoards = Math.min(
    superBoardMaxCount, Math.floor(boards.length / boardsPerSuperBoard));
  while (superBoards.length < numSuperBoards) {
    superBoards.push({
      winningGroups: [],
      emptyWin: false,
      id: Math.random(),
    });
  }

  // Update all super boards.
  for (let superBoardIdx=0; superBoardIdx<numSuperBoards; ++superBoardIdx) {
    // If super-board has just won, we need to reset its ID to force full redraw.
    if (superBoards[superBoardIdx].winningGroups.length > 0) {
      superBoards[superBoardIdx] = {
        winningGroups: [],
        emptyWin: false,
        id: Math.random(),
      }
    }

    let superWins = new Array(numPlayers).fill(0);

    // Compute current state of the super board.
    let superBoardCellState = new Array(boardsPerSuperBoard).fill(-1);
    let fullBoard = true;
    for (let i=0; i<boardsPerSuperBoard; i++) {
      let board = boards[superBoardIdx*boardsPerSuperBoard+i];
      if (board.numMovesMade === board.movesUntilWin) {
        superBoardCellState[i] = board.winner;
      } else {
        fullBoard = false;
      }
    }

    // Look for winners on the computed super board.
    let winningGroups = [];
    for (let winningGroup of cache.winningGroups) {
      let winner = superBoardCellState[winningGroup[0]];
      if (winner < 0) {
        continue;
      }
      if (winningGroup.every((cell) => (superBoardCellState[cell] === winner))) {
        superWins[winner] += 1;
        winningGroups.push(winningGroup);
      }
    }

    // Check winner and award coins.
    let emptyWin = (requireFull && !fullBoard);
    if (!emptyWin) {
      let critical = (superWins[0] + superWins[1] > 1);
      if (superWins[0] > 0) {
        let coinsWon = superCoinsPerWin * superWins[0];
        if (critical) {
          coinsWon *= criticalSuperWinMult;
        }
        coins[COIN_TYPE.COIN_TYPE_SUPER_X] += coinsWon;
      }
      if (superWins[1] > 0) {
        let coinsWon = superCoinsPerWin * superWins[1];
        if (critical) {
          coinsWon *= criticalSuperWinMult;
        }
        coins[COIN_TYPE.COIN_TYPE_SUPER_O] += coinsWon;
      }
    }

    if (winningGroups.length > 0) {
      superBoards[superBoardIdx] = {
        ...superBoards[superBoardIdx],
        winningGroups,
        emptyWin,
      };
    }
  }
  newState.superBoards = superBoards;
};


// Assumes that newState has:
//  - shallow copy of old state.
//  - mutable coins
//  - shallow copy of boards
export const performOneMove = (newState) => {
  if (newState.paused) {
    return;
  }
  let { boards, superBoards, appliedSBSettings, gameSettings, coins } = newState;
  let numBoardsPerSuperBoard = (appliedSBSettings.numRows * appliedSBSettings.numCols);
  for (let boardIdx=0; boardIdx<boards.length; ++boardIdx) {
    let superBoardIdx = Math.floor(boardIdx / numBoardsPerSuperBoard);
    let superBoardWon = (superBoardIdx < superBoards.length &&
                         superBoards[superBoardIdx].winningGroups.length > 0);
    boards[boardIdx] = computeNextBoard(boards[boardIdx], superBoardWon, gameSettings, coins);
  }
  updateSuperBoards(newState);
}
