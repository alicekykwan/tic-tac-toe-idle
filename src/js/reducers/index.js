import { ADD_BASIC_BOARD, DO_ONE_TICK_FOR_ALL_BOARDS } from "../constants/actionTypes";



const getStartingBasicBoard = () => {
  return {
    boardState: [['','',''], ['','',''], ['','','']],
    currentPlayer: 'X',
    winner: '',
    winningCells: []
  };
};

const initialState = {
  boards: [getStartingBasicBoard(), getStartingBasicBoard(), getStartingBasicBoard(), getStartingBasicBoard(), getStartingBasicBoard()]
};

let getUnusedCells = (board) => {
  let unusedCells = [];
  for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
          if (board[i][j] === '') {
            unusedCells.push(`${i},${j}`);
          }
      }
  }
  return unusedCells;
}



let returnWinningCells = (board, player) => {
  //check rows
  for (let i = 0; i < 3; i++) {
      let row = board[i];
      if (row[0] === row[1] && row[1] === row[2] &&  row[2] === player) {
          return [(i, 0), (i,1), (i,2)];
      };
  }
  //check columns
  for (let c = 0; c < 3; c++) {
      if (board[0][c] === board[1][c] && board[1][c] === board[2][c] && board[2][c] === player) {
          return [(0, c), (1, c), (2, c)];
      };
  }
  //check diagonals
  if (board[0][0] === board[1][1] && board[1][1] === board[2][2] && board[2][2] === player) {
      return [(0,0), (1,1), (2,2)];
  };
  if (board[2][0] === board[1][1] && board[1][1] === board[0][2] && board[0][2] === player) {
      return [(2,0), (1,1), (0,2)];
  };

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
  for (let i = 0; i < 3; i++) {
      let row = board[i];
      if (row[0] === row[1] && row[1] === row[2] &&  row[2] === player) {
          //setWinningCells([(i, 0), (i,1), (i,2)])
          return true;
      };
  }
  //check columns
  for (let c = 0; c < 3; c++) {
      if (board[0][c] === board[1][c] && board[1][c] === board[2][c] && board[2][c] === player) {
          //setWinningCells([(0, c), (1, c), (2, c)])
          return true;
      };
  }
  //check diagonals
  if (board[0][0] === board[1][1] && board[1][1] === board[2][2] && board[2][2] === player) {
      //setWinningCells([(0,0), (1,1), (2,2)])
      return true;
  };
  if (board[2][0] === board[1][1] && board[1][1] === board[0][2] && board[0][2] === player) {
      //setWinningCells([(2,0), (1,1), (0,2)])
      return true;
  };

  return false;
}

const doOneMove = (board) => {
  let { currentPlayer, boardState, winner, winningCells } = board;

  if (winner !== '') { return getStartingBasicBoard(); }

  let clonedBoardState = boardState.map(row => [...row]);
  let unusedCells = getUnusedCells(boardState);

  if (unusedCells.length === 0) { return getStartingBasicBoard(); }


  let [randR, randC] = unusedCells[Math.floor(Math.random() * unusedCells.length)].split(',');
  console.log('randR:', randR, ' randC:', randC);

  clonedBoardState[randR][randC] = currentPlayer;

  return {
    boardState: clonedBoardState,
    currentPlayer: currentPlayer === 'X' ? 'O' : 'X',
    winner: getBoardWinner(clonedBoardState),
    winningCells: getBoardWinner(clonedBoardState, currentPlayer)
  };
}

const doOneTickForAllBoards = (boards) => {
  return boards.map(doOneMove);
}

function rootReducer(state = initialState, action) {
  console.log('am ihere');
  if (action.type === ADD_BASIC_BOARD) {
    console.log('yo:', state.boards.concat([ getStartingBasicBoard() ]));
    return Object.assign({}, state, {
      boards: state.boards.concat([ getStartingBasicBoard() ])
    });
  }

  if (action.type === DO_ONE_TICK_FOR_ALL_BOARDS) {
    return Object.assign({}, state, {
      boards: doOneTickForAllBoards(state.boards)
    });
  }
  return state;
}

export default rootReducer;