import '../../css/Board.css';
import Box from '@material-ui/core/Box';


function Board(props) {
  let { board } = props;
  let { boardState, winState, numRows, numCols } = board;
  const gridSize = 240;
  const gridMargin = 20;
  let cellSize = gridSize / numRows;

  let getCellColor = (cell) => {
    if (winState[cell]) {
      return 'text.win';
    } else if (boardState[cell] === "X") {
      return 'text.x';
    } else if (boardState[cell] === "O") {
      return 'text.o';
    } else {
      return '';
    }
  }

  let getCellText = (cell) => {
    if (boardState[cell] === "X") {
      return '✘';
    } else if (boardState[cell] === "O") {
      return 'O';
    } else {
      return '';
    }
  }

  let renderGrid = () => {
    let result = [];

    for (let i = 0; i < numRows; i++) {
      let newRow = [];
      for (let j = 0; j < numCols; j++) {
        let cell = i * numCols + j;
        newRow.push(
          <Box key={`row-${i}-col-${j}`} className="tic-tac-toe-cell"
              color={getCellColor(cell)}
              style={{ width: cellSize, height: cellSize, fontSize: cellSize }}>
            {getCellText(cell)}
          </Box>
        );
      }
      result.push(<div key={`row-${i}`} className="tic-tac-toe-row">
          { newRow }
      </div>);
    }
    return result;
  };

  return <Box boxShadow={3} bgcolor="background.default"
    style={{width: gridSize, height: gridSize, margin: gridMargin}}>
    { renderGrid() }
  </Box>;
}

export default Board;
