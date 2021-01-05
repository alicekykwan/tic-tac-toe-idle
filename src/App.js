import { useState } from 'react';

function App() {


  setEffect(() => {
    setInterval()
  }, []);

  let renderGame = (numBoards) => {
    let res = []
    for (let i =0; i< numBoards; i++) {
      res.push('a game board')
    }
    return res
  }

  return (
    <div className="App">
      <div className="game">
       { renderGame(numBoards) }
      </div>
      <button onClick = {()=>setNumBoards(numBoards+1)}> more boards </button>
      <button onClick = {()=>setNumBoards(numBoards-1)}> fewer boards </button>
    </div>
  );
}

export default App;
