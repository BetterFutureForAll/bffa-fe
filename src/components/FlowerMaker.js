import React, { useEffect } from 'react';
import * as d3 from 'd3';
import { scaleRadial } from 'd3';
import petal from '../assets/single4petal.svg';
import { useCountries, useHandleCountryChange } from '../hooks/hooks';
import { getSpiDataByCountry } from '../services/SocialProgress';

let hardData = require('../assets/2011-2020-Social-Progress-Index.csv')


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
let data = d3.csv(spiByYear).then(d => 
  //get the values of the data points we want here.
      values(d)
  );

let SVG = d3.select("my-svg");
let path = 
"M550.25,378.1c0,0-14.33-33.61-62.27-44.08c-45.95-10.03-56.21-35.82-57.26-38.83v-0.3c0,0-0.02,0.06-0.05,0.15"
"				c-0.03-0.09-0.05-0.15-0.05-0.15v0.3c-1.05,3.01-11.31,28.79-57.26,38.83c-47.94,10.47-62.27,44.08-62.27,44.08"
"				s-20.51,32.52,26.92,84.45c9.92,10.86,92.63,106.57,92.63,106.57s82.54-97.85,93.63-108.29"
"				C573.42,414.54,550.25,378.1,550.25,378.1z M505.82,460.24c-9.12,8.59-77.03,89.09-77.03,89.09s-68.04-78.74-76.2-87.67"
"				c-39.02-42.72-22.14-69.47-22.14-69.47s11.79-27.65,51.22-36.27c37.8-8.26,46.24-29.47,47.11-31.94v-0.24"
"				c0,0,0.02,0.05,0.04,0.12c0.02-0.07,0.04-0.12,0.04-0.12v0.24c0.87,2.48,9.31,23.69,47.11,31.94"
"				c39.44,8.61,51.22,36.27,51.22,36.27S546.26,422.16,505.82,460.24z";

const numPetalScale = d3.scaleQuantize().domain(/* Data Point  */).range([/*n umber of petals */]);

// orient a flower object, and iterate the data to create the size.
const flowersData = _.map(data, d => {
  const numPetals = numPetalScale(+d./*data point */);
  console.log(numPetals);
  const petSize = sizeScale(+d./* scores */); 
  return {
    petSize, 
    petals: _.times(numPetals, i => {return {angle: 360 * i / numPetals, petalPath}}),
    numPetals,
  }
});  


useEffect(()=> {
  console.log(data);
}, [spiByYear]);

  return (
      <div id="FlowerMaker">
        <h2>{selectCountries}</h2>
        <svg id="my-svg" d={petalPath}></svg>
      </div>
    );
}

export default FlowerMaker;