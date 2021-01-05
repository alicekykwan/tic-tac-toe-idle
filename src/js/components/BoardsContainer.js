import React from "react";
import { connect } from "react-redux";
import TicTacToeGrid from "./TicTacToeGrid";
import '../../css/App.css';

const mapStateToProps = state => {
  return { boards: state.boards };
};

const ConnectedBoardsContainer = ({ boards }) => (
  <div className="connected-boards-container">
    {boards.map((board, i) => (<TicTacToeGrid key={i} board={board} /> ))}
  </div>
);

const BoardsContainer = connect(mapStateToProps)(ConnectedBoardsContainer);

export default BoardsContainer;