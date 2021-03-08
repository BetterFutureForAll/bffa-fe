import { useEffect, useState } from 'react';
import * as d3 from 'd3';
  
export const useFlowersData = (spiByYear, height, width, petalSize) => {
  var _ = require('lodash');

  let [flowersData, setFlowersData] = useState([]);

  // Top level to clean data as its fed to FlowerMaker component
  let data = _.values(spiByYear);
  // Computes the Extent; domain and range, of the dataset.
  const spiMinMax = d3.extent(data, d => +d["Social Progress Index"]);
  const basicMinMax = d3.extent(data, d => +d["Basic Human Needs"]);
  const foundationsMinMax = d3.extent(data, d => +d["Foundations of Wellbeing"]);
  const oppMinMax = d3.extent(data, d => +d["Opportunity"]);
  
  const spiScale = d3.scaleLinear().domain(spiMinMax).range([0,1]);
  
  const sizeBasicScale = d3.scaleLinear().domain(basicMinMax).range([0, 1]);
  const sizeFoundationsScale = d3.scaleLinear().domain(foundationsMinMax).range([0, 1]);
  const sizeOppScale = d3.scaleLinear().domain(oppMinMax).range([0, 1]);

  // orient a flower object, and iterate the data to create the size.

  let petalPath = 'M 0 0 c 0 75 37 40 45 45 C 40 37 75 0 0 0';

  const makeFlowersData = _.map(data, d => {
    let spi = +d["Social Progress Index"];
    const spiSize = spiScale(spi);

    let basicNeeds = +d["Basic Human Needs"];
    const basicSize = sizeBasicScale(basicNeeds);

    let foundations = +d["Foundations of Wellbeing"];
    const foundationSize = sizeFoundationsScale(foundations);

    let opportunity = +d["Opportunity"];
    const oppSize = sizeOppScale(opportunity);

    // Format an individual flower object
    // petals change to reflect 3 categories (basic needs etc)
    return {
      petals: [
        { angle: -20, petalPath, petSize: basicSize, colorRef: basicNeeds }, 
        { angle: 100, petalPath, petSize: foundationSize, colorRef: foundations }, 
        { angle: 220, petalPath, petSize: oppSize, colorRef: opportunity}
      ],
      spiScale: spiSize,
      spi,
      name: d["Country"],
      status: d["Status"]
    }
  })
  useEffect(()=> {
    setFlowersData(makeFlowersData);
    console.log('Flower Data Change Detected', flowersData);
  },[spiByYear]);
  return [flowersData, setFlowersData];
};