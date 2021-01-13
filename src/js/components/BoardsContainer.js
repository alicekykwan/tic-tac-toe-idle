import React from "react";
import { connect } from "react-redux";
import Box from '@material-ui/core/Box';
import BoardCanvas from "./BoardCanvas";

const mapStateToProps = state => {
  return {
    boards: state.boards,
    lastTickTime: state.lastTickTime,
  };
};

const ConnectedBoardsContainer = ({ boards, lastTickTime }) => {
  return (
    <Box key='boards-container' width='100%' display='flex' flexDirection='row' flexWrap='wrap'>
      {boards.map((board, i) => (
        <BoardCanvas key={i} board={board} lastTickTime={lastTickTime}
            width={240} height={240} margin={16} padding={16} />
      ))}
    </Box>
  );
};

const BoardsContainer = connect(mapStateToProps)(ConnectedBoardsContainer);

export default BoardsContainer;