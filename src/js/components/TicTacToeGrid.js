import '../../css/TicTacToeGrid.css';

function TicTacToeGrid(props) {
    let { board } = props;
    let { boardState, winState, numRows, numCols } = board;
    const gridSize = 240;
    const gridMargin = 20;
    let cellSize = gridSize / numRows;
    //let boardDimension = 3;

    let renderCell = (cell) => {
        if (winState[cell]) {
            return <div className="cell-text-Win"> {boardState[cell]} </div>;
        } else if (boardState[cell] === "X") {
            return <div className="cell-text-X">X</div>;
        } else if (boardState[cell] === "O") {
            return <div className="cell-text-O">O</div>;
        }
    }

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
                        {renderCell(cell)}
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
