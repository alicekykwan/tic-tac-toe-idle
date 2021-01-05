import React, { useEffect, useState } from "react";
import SingleBoard from './SingleBoard';

function AllBoards(props) {
  let { gameSpeed, coinsPerWin, numBoards, addCoins } = props;

  let boards = [];
  for (var boardIndex=0; boardIndex<numBoards; ++boardIndex) {
    boards.push(<SingleBoard key={boardIndex} addCoins={(amt)=>addCoins(coinsPerWin*amt)} gameSpeed={gameSpeed}/>);
  }
  return <div>
    {boards}
  </div>;
}

export default AllBoards;