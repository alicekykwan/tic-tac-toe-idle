import { useState, useEffect, useRef } from 'react';
import '../../css/TicTacToeGrid.css';

function TicTacToeGrid(props) {
    const TIE = "Tie"
    let { board, boardDimension } = props;
    let { boardState, winningCells } = board;
    //let boardDimension = 3;

    let renderGrid = () => {
        let result = [];

        for (let i = 0; i < boardDimension; i++) {
            let newRow = [];
            for (let j = 0; j < boardDimension; j++) {
                newRow.push(
                    <div key={`row-${i}-col-${j}`} className="tic-tac-toe-cell">
                        {boardState[i*boardDimension+j] === "X"
                        ? (winningCells && winningCells.includes(i*boardDimension+j) ? <div className="cell-text-Win"> {boardState[i*boardDimension+j]} </div>:<div className="cell-text-X"> {boardState[i*boardDimension+j]} </div>)   
                        : (winningCells && winningCells.includes(i*boardDimension+j) ? <div className="cell-text-Win"> {boardState[i*boardDimension+j]} </div>:<div className="cell-text-O"> {boardState[i*boardDimension+j]} </div>)   
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
