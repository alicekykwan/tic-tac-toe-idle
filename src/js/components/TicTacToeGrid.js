import { useState, useEffect, useRef } from 'react';
import '../../css/TicTacToeGrid.css';

function TicTacToeGrid(props) {
    const TIE = "Tie"
    let { setIsPlaying, isPlaying, board, setBoardState, mode, randomMoveTimerRef=null, stat, setStat } = props;
    let { boardState, currentPlayer, winner, winningCells } = board;

    let renderGrid = () => {
        let result = [];

        for (let i = 0; i < 3; i++) {
            let newRow = [];
            for (let j = 0; j < 3; j++) {
                newRow.push(
                    <div key={`row-${i}-col-${j}`} className="tic-tac-toe-cell">
                        {boardState[i][j] === "X"
                        ? (winningCells && winningCells.includes((i,j)) ? <div className="cell-text-Win"> {boardState[i][j]} </div>:<div className="cell-text-X"> {boardState[i][j]} </div>)   
                        : (winningCells && winningCells.includes((i,j)) ? <div className="cell-text-Win"> {boardState[i][j]} </div>:<div className="cell-text-O"> {boardState[i][j]} </div>)   
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

export default TicTacToeGrid;
