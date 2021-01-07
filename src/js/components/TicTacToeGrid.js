import { useState, useEffect, useRef } from 'react';
import '../../css/TicTacToeGrid.css';

function TicTacToeGrid(props) {
    const TIE = "Tie"
    let { board } = props;
    let { boardState, winningCells, numRows, numCols } = board;
    const gridSize = 240;
    const gridMargin = 20;
    let cellSize = gridSize / numRows;
    //let boardDimension = 3;

    let renderGrid = () => {
        let result = [];

        for (let i = 0; i < numRows; i++) {
            let newRow = [];
            for (let j = 0; j < numCols; j++) {
                let cell = i * numCols + j;
                newRow.push(
                    <div key={`row-${i}-col-${j}`} className="tic-tac-toe-cell"
                        style={{
                            width: cellSize,
                            height: cellSize,
                            "font-size": cellSize
                        }}>
                        {boardState[cell] === "X"
                        ? (winningCells && winningCells.includes(cell) ? <div className="cell-text-Win"> {boardState[cell]} </div>:<div className="cell-text-X"> {boardState[cell]} </div>)   
                        : (winningCells && winningCells.includes(cell) ? <div className="cell-text-Win"> {boardState[cell]} </div>:<div className="cell-text-O"> {boardState[cell]} </div>)   
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

    return <div
        className="tic-tac-toe-grid"
        style={{width: gridSize, height: gridSize, margin: gridMargin}}>
        { renderGrid() }
    </div>;
}

export default TicTacToeGrid;
