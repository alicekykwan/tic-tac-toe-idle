import React from "react";
import { connect } from "react-redux";
import TicTacToeGrid from "./TicTacToeGrid";
import '../../css/App.css';

const mapStateToProps = state => {
  return { boards: state.boards, boardDimension: state.boardDimension};
};

const ConnectedBoardsContainer = ({ boards, boardDimension }) => (
  <div className="connected-boards-container">
    {boards.map((board, i) => (<TicTacToeGrid key={i} board={board} boardDimension={boardDimension}/> ))}
  </div>
);

const BoardsContainer = connect(mapStateToProps, null)(ConnectedBoardsContainer);

export default BoardsContainer;