import { useEffect, useState } from 'react';
import * as d3 from 'd3';

export const useFlowersData = (spiByYear) => {
  let [flowersData, setFlowersData] = useState(null);
  let _ = require('lodash');


  // orient a flower object, and iterate the data to create the size.
  let petalPath = 'M 0 0 c 0 75 37 40 45 45 C 40 37 75 0 0 0';


  //**bootstrap a country object on first render 
  // ** or wait to call useD3 on drawflowers.js **/

  //wait for data
  //structure an flower Object from the data
  let makeFlower = spiByYear.map(d => {
    const spiScale = d3.scaleLinear().domain([0, 100]).range([0, 1]);
    const sizeBasicScale = d3.scaleLinear().domain([0, 100]).range([0, 1]);
    const sizeFoundationsScale = d3.scaleLinear().domain([0, 100]).range([0, 1]);
    const sizeOppScale = d3.scaleLinear().domain([0, 100]).range([0, 1]);

    let spi = +d["Social Progress Index"];
    const spiSize = spiScale(spi);

    let basicNeeds = +d["Basic Human Needs"];
    const basicSize = sizeBasicScale(basicNeeds);

    let foundations = +d["Foundations of Wellbeing"];
    const foundationSize = sizeFoundationsScale(foundations);

    let opportunity = +d["Opportunity"];
    const oppSize = sizeOppScale(opportunity);

    // petals change to reflect 3 categories (basic needs etc)
    return {
      petals: [
        { angle: -20, petalPath, petSize: basicSize, colorRef: basicNeeds },
        { angle: 100, petalPath, petSize: foundationSize, colorRef: foundations },
        { angle: 220, petalPath, petSize: oppSize, colorRef: opportunity }
      ],
      spiScale: spiSize,
      spi,
      name: d["Country"],
      status: d["Status"],
    };
  });


  useEffect(() => {
    console.log('Flower Data Change Detected', spiByYear);
    console.log('type', typeof spiByCountry);
    console.log(typeof makeFlower);
    if (makeFlower.length > 0) {
      setFlowersData(makeFlower)
    };
  }, [spiByYear]);

  console.log('flowersData', flowersData);
  return [flowersData];
};