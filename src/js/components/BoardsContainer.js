import React from "react";
import { connect } from "react-redux";
import BoardCanvas from "./BoardCanvas";
import '../../css/App.css';

const mapStateToProps = state => {
  return {
    boards: state.boards,
    lastTickTime: state.lastTickTime,
  };
};

const ConnectedBoardsContainer = ({ boards, lastTickTime }) => {
  return (
    <div className="boards-container">
      {boards.map((board, i) => (
        <BoardCanvas key={i} board={board} lastTickTime={lastTickTime}
            width={240} height={240} margin={20} padding={10} />
      ))}
    </div>
  );
};

const BoardsContainer = connect(mapStateToProps)(ConnectedBoardsContainer);

export default BoardsContainer;