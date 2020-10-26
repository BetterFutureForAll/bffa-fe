import React, { useState } from "react";
import ReactTooltip from "react-tooltip";
import './App.css';
import MapContainer from './containers/Map';
import  { useSelector, useDispatch } from 'react-redux';
import { getScore } from "./selectors/scoreSelector";


function App() {

  // const [content, setContent] = useState("");

  // const Route = ({...rest }) => {
  //   const dispatch = useDispatch();
  //   const score = useSelector(getScore);

  // };

  return (
    <div className="App">
      <header className="App-header">
      <MapContainer />
      </header>
    </div>


  );
}

export default App;
