import React, { useEffect } from "react";
import List from "./List";
import Form from "./Form";
import index from '../index'
import { addBasicBoard, doOneTickForAllBoards } from "../actions/index";
import { connect } from "react-redux";


import '../../css/App.css';

import BoardsContainer from "./BoardsContainer";


function mapDispatchToProps(dispatch) {
  return {
    addBasicBoard: () => dispatch(addBasicBoard()),
    doOneTickForAllBoards: () => dispatch(doOneTickForAllBoards())
  };
}

function ConnectedApp({ addBasicBoard, doOneTickForAllBoards }) {
  useEffect(() => {
    console.log('hello');
    setInterval(doOneTickForAllBoards, 20);
  } ,[]);

  return (
    <div className="App">
      <button onClick={addBasicBoard}> Add board</button>
      <div className="game">
       <BoardsContainer />
      </div>
    </div>
  );
}

const App = connect(
  null,
  mapDispatchToProps
)(ConnectedApp);

export default App;