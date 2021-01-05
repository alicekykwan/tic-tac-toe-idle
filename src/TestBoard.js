import React, { useEffect, useState } from "react";

function TestBoard(props) {
  let { boardIndex } = props;
  let [ counter, setCounter ] = useState(0);
  
  useEffect(() => {
    let currspeed = 1000
    setTimeout(() => {setCounter(counter + 1)}, currspeed);
  }, [counter])
  
  return <div>Test Board #{boardIndex+1}: value = {counter}<br /></div>;
}

export default TestBoard;