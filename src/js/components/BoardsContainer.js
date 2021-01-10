import React from "react";
import { connect } from "react-redux";
import BoardCanvas from "./BoardCanvas";
import { THEME_TYPE, THEME_ELEMENT, getTheme } from '../themes/themes'
import { ThemeProvider } from '@material-ui/core/styles';
import '../../css/App.css';

const mapStateToProps = state => {
  return { boards: state.boards };
};

const ConnectedBoardsContainer = ({ boards }) => {
  return (
    <div className="boards-container">
      {boards.map((board, i) => (
        <BoardCanvas key={i} board={board}
        width={240} height={240} margin={20} padding={10} />
      ))}
    </div>
  );
};

const BoardsContainer = connect(mapStateToProps)(ConnectedBoardsContainer);

export default BoardsContainer;