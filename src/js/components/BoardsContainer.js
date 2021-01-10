import React from "react";
import { connect } from "react-redux";
import Board from "./Board";
import { THEME_TYPE, THEME_ELEMENT, getTheme } from '../themes/themes'
import { ThemeProvider } from '@material-ui/core/styles';
import '../../css/App.css';

const mapStateToProps = state => {
  return { boards: state.boards };
};

const ConnectedBoardsContainer = ({ boards }) => (
  <ThemeProvider theme={getTheme(THEME_TYPE.NORMAL, THEME_ELEMENT.BOARD)}>
    <div className="boards-container">
      {boards.map((board, i) => (<Board key={i} board={board} /> ))}
    </div>
  </ThemeProvider>
);

const BoardsContainer = connect(mapStateToProps)(ConnectedBoardsContainer);

export default BoardsContainer;