import React, { useEffect, useState } from "react";
import Grid from "@material-ui/core/Grid";  
import './SingleBoard.css'

function SingleBoard(props) {

  let { gameSpeed, addCoins } = props;
  const TIE = "TIE";

  let [ boardState, setBoardState ] = useState({
    board: [['','',''], ['','',''], ['','','']],
    currentPlayer: 'X',
    winner: '',
    winningCells: []
  });

  let performOneMove = () => {
    if (boardState.winner === '') {
      makeRandomMove();
    } else {
      startNextRound();
    }
  }

  useEffect(() => {
    let currspeed = 1000/gameSpeed;  // TODO: replace with timer
    setTimeout(performOneMove, currspeed);
  }, [boardState, gameSpeed])


  let getUsedCells = (board) => {
    let usedcells = 0;
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (board[i][j] !== '') {
                usedcells += 1
            }
        }
    }
    return usedcells;
}

let makeRandomMove = () => {
    while (boardState.winner === "") {
        let rand = Math.floor(Math.random() * 9); 
        let c = rand%3;
        let r = Math.floor(rand/3);
        if (boardState.board[r][c] === '') {
            makeMove(r, c, boardState.currentPlayer)
            break
        }
    }
}


let makeMove = (row, col, curr) => {
    if (boardState.winner === "" && boardState.board[row][col] === "") {
        let newBoard = [ ...boardState.board.map(row => [...row])];
        newBoard[row][col] = boardState.currentPlayer;
        let currwinner = getBoardWinner(newBoard);
        let currwinningCells = []
        if (currwinner === 'X' || currwinner === 'O') {
            currwinningCells = returnWinningCells(newBoard, currwinner)
        }
        
        setBoardState({
            board: newBoard,
            currentPlayer: curr === 'O' ? 'X' : 'O',
            winner: currwinner,
            winningCells: currwinningCells
        });
        if (currwinner !== '') {
            if (currwinner === 'X') {
                addCoins(1);
            } else if (currwinner === 'O') {
                addCoins(1);
            }
        }
    }
};

let getBoardWinner = (board) => {
    if (hasPlayerWon(board, 'O')) { return 'O'; }
    if (hasPlayerWon(board, 'X')) { return 'X'; }
    if (getUsedCells(board) === 9) { return TIE; }
    return '';
}

let hasPlayerWon = (board, player) => {
    //check rows
    for (let i = 0; i < 3; i++) {
        let row = board[i];
        if (row[0] === row[1] && row[1] === row[2] &&  row[2] === player) {
            return true;
        };
    }
    //check columns
    for (let c = 0; c < 3; c++) {
        if (board[0][c] === board[1][c] && board[1][c] === board[2][c] && board[2][c] === player) {
            return true;
        };
    }
    //check diagonals
    if (board[0][0] === board[1][1] && board[1][1] === board[2][2] && board[2][2] === player) {
        return true;
    };
    if (board[2][0] === board[1][1] && board[1][1] === board[0][2] && board[0][2] === player) {
        return true;
    };

    return false;
}

let returnWinningCells = (board, player) => {
    //check rows
    let result = []
    for (let i = 0; i < 3; i++) {
        let row = board[i];
        if (row[0] === row[1] && row[1] === row[2] &&  row[2] === player) {
            result = [[i, 0], [i,1], [i,2]];
        };
    }
    //check columns
    for (let c = 0; c < 3; c++) {
        if (board[0][c] === board[1][c] && board[1][c] === board[2][c] && board[2][c] === player) {
            result = [[0, c], [1, c], [2, c]];
        };
    }
    //check diagonals
    if (board[0][0] === board[1][1] && board[1][1] === board[2][2] && board[2][2] === player) {
        result = [[0,0], [1,1], [2,2]];
    };
    if (board[2][0] === board[1][1] && board[1][1] === board[0][2] && board[0][2] === player) {
        result = [[2,0], [1,1], [0,2]];
    };

    return result.map(pair => `${pair[0]},${pair[1]}`);
}

let startNextRound = (winner) => {
    setBoardState({
        board: [['','',''], ['','',''], ['','','']],
        currentPlayer: 'X',
        winner: '',
        winningCells: []
    });
}


let renderGrid = () => {
    let result = [];

    for (let i = 0; i < 3; i++) {
        let newRow = [];
        for (let j = 0; j < 3; j++) {
            newRow.push(
                <div key={`row-${i}-col-${j}`}
                     onClick={() => makeMove(i, j, boardState.currentPlayer)}
                     className="tic-tac-toe-cell">
                    {boardState.board[i][j] === "X"
                    ? (boardState.winningCells && boardState.winningCells.includes(`${i},${j}`) ? <div className="cell-text-Win"> {boardState.board[i][j]} </div>:<div className="cell-text-X"> {boardState.board[i][j]} </div>)   
                    : (boardState.winningCells && boardState.winningCells.includes(`${i},${j}`) ? <div className="cell-text-Win"> {boardState.board[i][j]} </div>:<div className="cell-text-O"> {boardState.board[i][j]} </div>)   
                    }
                </div>
            );
        }
        result.push(<div key={`row-${i}`} className="tic-tac-toe-row">
            { newRow }
        </div>);
    }

    


    return result;
};

return <div className="tic-tac-toe-grid">
    { renderGrid() }
</div>;






}   

export default SingleBoard;