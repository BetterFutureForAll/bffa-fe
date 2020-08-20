import React from 'react';
import './App.css';
import * as d3 from 'd3';
import { Geographies, Geography, ComposableMap } from "react-simple-maps";

import * as california_data from './assets/2019-california-results.csv';
import * as dataDefinitions from './assets/definitions.csv';
const geoUrl = 'https://raw.githubusercontent.com/deldersveld/topojson/master/countries/us-states/CA-06-california-counties.json';

function App() {

//d3 imports the CSV and is merely logging it
  d3.csv(california_data).then(function(data) {
    console.log(data);
  });

  d3.csv(dataDefinitions).then(function(data) {
    console.log(data);
  //   for (var i = 0; i < data.length; i++) {
  //     console.log(data[i].Dimension);
  //     console.log(data[i].Component);
  // }
  });


  return (
    <div className="App">
      <header className="App-header">
        <p>
          Hello World
        </p>
      </header>
      {/* <div className="mapBox">
        <ComposableMap>
          <Geographies geography={geoUrl}>
              {({ geographies }) =>
                geographies.map(geo => <Geography key={geo.rsmKey} geography={geo} />)
              }
          </Geographies>
        </ComposableMap>
      </div> */}
    </div>


  );
}

export default App;
