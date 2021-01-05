import { useState } from 'react';
import AllBoards from './AllBoards';

function App() {
  let [ gameSpeed, setGameSpeed ] = useState(3);
  let [ coinsPerWin, setCoinsPerWin ] = useState(1);
  let [ numBoards, setNumBoards ] = useState(3);
  let [ coins, setCoins ] = useState(0);

  let addCoins = (numCoins) => { setCoins(coins + numCoins); }

  return (
    <div className="App">
      <AllBoards
        key="main"
        gameSpeed={gameSpeed}
        coinsPerWin={coinsPerWin}
        numBoards={numBoards}
        addCoins={addCoins} />
      <br/>
      <button onClick = {()=>setGameSpeed(gameSpeed+1)}> faster </button>
      <button onClick = {()=>setGameSpeed(Math.max(gameSpeed-1, 1))}> slower </button>
      <br/>
      <button onClick = {()=>setCoinsPerWin(coinsPerWin+1)}> more coins per win </button>
      <button onClick = {()=>setCoinsPerWin(coinsPerWin-1)}> fewer coins per win </button>
      <br/>
      <button onClick = {()=>setNumBoards(numBoards+1)}> more boards </button>
      <button onClick = {()=>setNumBoards(Math.max(numBoards-1, 1))}> fewer boards </button>
      <br/>
      <div>
        coins: {coins} <br />
        game speed: {gameSpeed} <br />
        coins per win: {coinsPerWin} <br />
        num boards: {numBoards} <br />
      </div>
    </div>
  );
}

export default App;
