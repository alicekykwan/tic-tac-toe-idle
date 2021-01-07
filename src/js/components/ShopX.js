import React, { useEffect } from "react";
import { addBasicBoardAction, updateBoardSettingsAction } from "../actions/index";
import { connect } from "react-redux";
import '../../css/ShopX.css';


const mapStateToProps = state => {
  return {
    coins: state.coins,
    boardSettings: state.boardSettings,
  };
};

function mapDispatchToProps(dispatch) {
  return {
    addBasicBoard: () => dispatch(addBasicBoardAction()),
    updateBoardSettings: (boardSettings) => dispatch(updateBoardSettingsAction(boardSettings)),
  };
}

function ConnectedShopX({ coins, boardSettings, addBasicBoard, tick, updateBoardSettings }) {
  useEffect(() => {
    console.log('hello');
    setInterval(tick, 50);
  } ,[]);

  let { numRows, numCols } = boardSettings;

  const increaseBoardSize = () => {
    numRows += 1;
    numCols += 1;
    updateBoardSettings({numRows, numCols});
  };

  const decreaseBoardSize = () => {
    if (numRows === 1) {
      return;
    }
    numRows -= 1;
    numCols -= 1;
    updateBoardSettings({numRows, numCols});
  };

  return (
    <div className="Shop">
      <button onClick={addBasicBoard}> Add board</button>
      <button onClick={increaseBoardSize}> Increase Board Size</button>
      <button onClick={decreaseBoardSize}> Decrease Board Size</button>
      <p>Board Size: {numRows} by {numCols} (applies on board reset) </p>
    </div>
  );
}

const ShopX = connect(
  mapStateToProps,
  mapDispatchToProps
)(ConnectedShopX);

export default ShopX;