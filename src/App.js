import React, { useState } from "react";
import ReactDOM from "react-dom";
import ReactTooltip from "react-tooltip";
import './App.css';
import MapChart from './components/MapChart';

// import * as d3 from 'd3';
// import * as california_data from './assets/2019-california-results.csv';
// import * as dataDefinitions from './assets/definitions.csv';


function App() {

  const [content, setContent] = useState("");

  return (
    <div className="App">
      <header className="App-header">
      <MapChart setTooltipContent={setContent} />
      <ReactTooltip>{content}</ReactTooltip>
      </header>
    </div>


  );
}

export default App;
