import React from "react";
import { connect } from "react-redux";
import Box from '@material-ui/core/Box';
import BoardCanvas from "./BoardCanvas";
import SuperBoardCanvas from "./SuperBoardCanvas";

const mapStateToProps = state => {
  return {
    appliedSBSettings: state.appliedSBSettings,
    superBoards: state.superBoards,
    boards: state.boards,
    lastTickTime: state.lastTickTime,
  };
};

const ConnectedBoardsContainer = ({ appliedSBSettings, superBoards, boards, lastTickTime }) => {
  let superBoardCanvases = [];
  let boardsPerSuperBoard = appliedSBSettings.numRows * appliedSBSettings.numCols;
  for (let i=0; i<superBoards.length; ++i) {
    superBoardCanvases.push(
      <SuperBoardCanvas key={`super${i}`} lastTickTime={lastTickTime}
          boards={boards.slice(i*boardsPerSuperBoard, (i+1)*boardsPerSuperBoard)}
          appliedSBSettings={appliedSBSettings}
          superBoard={superBoards[i]}
          width={496} height={496} padding={16} />);
  }

  let boardCanvases = [];
  for (let i=superBoards.length * boardsPerSuperBoard; i<boards.length; ++i) {
    boardCanvases.push(
      <BoardCanvas key={i} board={boards[i]} lastTickTime={lastTickTime}
          width={240} height={240} padding={16} />);
  }

  return (
    <Box key='boards-container' width='100%' display='flex' flexDirection='row' flexWrap='wrap' p={1}>
      <Box key='super-boards-container' display='flex' flexDirection='row' flexWrap='wrap' p={1}>
        {superBoardCanvases}
      </Box>
      <Box key='regular-boards-container' display='flex' flexDirection='row' flexWrap='wrap' p={1}>
        {boardCanvases}
      </Box>
    </Box>
  );
};

const BoardsContainer = connect(mapStateToProps)(ConnectedBoardsContainer);

export default BoardsContainer;