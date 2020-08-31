import React, { useState } from "react";
import ReactTooltip from "react-tooltip";
import './App.css';
import MapChart from './components/MapChart';

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
