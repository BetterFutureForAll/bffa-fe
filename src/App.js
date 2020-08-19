import React from 'react';
import './App.css';
import * as d3 from 'd3';
import * as california_data from './assets/2019-california-results.csv';

function App() {
  d3.csv(california_data).then(function(data) {
    console.log(data);
  });
  return (
    <div className="App">
      <header className="App-header">
        <p>
          Hello World
        </p>
        

      </header>
    </div>
  );
}

export default App;
