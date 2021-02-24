import React, { useEffect } from 'react';
import * as d3 from 'd3';
import { scaleRadial } from 'd3';
import petal from '../assets/single4petal.svg';
import { useCountries, useHandleCountryChange } from '../hooks/hooks';
import { getSpiDataByCountry } from '../services/SocialProgress';

let hardData = require('../assets/2011-2020-Social-Progress-Index.csv')
var _ = require('lodash');



// Petals for Basic Human Needs, Foundations of Wellbeing, and Opportunity
// SPI Score in the middle
// Wrap it all in a circle for ease of use / reuse
const FlowerMaker = ({ spiByYear }) => {

  let [countries] = useCountries();
  let [countryValue, handleCountryChange] = useHandleCountryChange();

  let selectCountries = (
    <select onChange={handleCountryChange} defaultValue={countryValue}>
      {countries.map(item => (
        <option key={item} value={item}>
          {item}
        </option>
      ))}
    </select>
    );


// ********************************Different Example here *************************






// Data imported here, needs to be cleaned up (strings to numbers etc)
// Top level to clean data as its fed to FlowerMaker component
let data = spiByYear;
let SVG = d3.select("my-svg");
let petalSize = 100;
let petalPath = 'M 0,0 C -10,-10 -10,-40 0,-50 C 10,-40 10,-10 0,0';


const ratingMinMax = d3.extent(data, d => [
  +d["Social Progress Index"], 
  +d["Foundations of Wellbeing"],
  +d["Basic Human Needs"],
  +d["Basic Human Needs"]
]);
const sizeScale = d3.scaleLinear().domain(ratingMinMax).range([0, 100]);
const scoreMinMax =  d3.extent(data, d => [
  +d["Social Progress Index"], 
  +d["Foundations of Wellbeing"],
  +d["Basic Human Needs"],
  +d["Basic Human Needs"]
]);

//numPetalScale scales data from a domain into a range of petals.

//fixed to 3 / 4 petals per category
const numPetalScale = d3.scaleQuantize().domain(scoreMinMax).range([1,3,4,6,9,12]);

const numPetals = 4;

//scale the size of each petal
const spiPetalSize = sizeScale(data, d=> d[0]);
const foundationsPetalSize = sizeScale(data, d=> +d[1]); 
const basicPetalSize = sizeScale(data, d=> +d[2]); 
const opportunityPetalSize = sizeScale(data, d=> +d[3]); 

let petSize = { spiPetalSize, foundationsPetalSize, basicPetalSize, opportunityPetalSize }

// orient a flower object, and iterate the data to create the size.

// Basic Human Needs
// Foundations of Wellbeing
// Opportunity

const flowersData = _.map(data, d => {
  // Format an individual flower object
  // petals change to reflect 3 categories (basic needs etc)
  return {
    petSize, 
    // Nested object, with each petal being assigned to a category
    // petals: { },
    petals: _.times(numPetals, i => {return {angle: 360 * i / numPetals, petalPath}}),
    numPetals,
  }
});

function drawFlowers() {
  const flowers = SVG
    .selectAll('g')
    .data([flowersData])
    .enter()
    .append('g')
    .attr('transform', (d, i) => `translate(${(i % 5) * petalSize},${Math.floor(i / 5) * petalSize})scale(${d.petSize})`);
    
    flowers.selectAll('path')
    .data(d => d.petals)
    .enter()
    .append('path')
    .attr('d',d => d.petalPath)
    .attr('transform', d=> `rotate(${d.angle})`)
};
  
useEffect(()=> {
  drawFlowers();
  console.log(data);
  console.log(ratingMinMax);
  console.log(spiPetalSize);
  console.log(flowersData);
}, [spiByYear]);

  return (
      <div id="FlowerMaker">
        <h2>{selectCountries}</h2>
        <svg id="my-svg" ><path transform="translate(25,50)" d={petalPath}/></svg>
      </div>
    );
}

export default FlowerMaker;