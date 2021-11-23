import * as d3 from 'd3';
import * as csvDefinitions from '../assets/definitions.csv';
let currentData = require('../assets/SPI2011-2021-dataset.csv');


// Columns ['SPI Rank', 'Country', 'SPI country code', 'SPI year', 'Status', 'Social Progress Index']

export const definitions = d3.csv(csvDefinitions, function(d) {
  return d;
});

export const spi2020 = d3.csv(currentData, function(d) {
  return d;
});

export function byYear(chosenYear) {
  let result = [];
  d3.csv(currentData, function(data) {
    data.forEach((element) => {
      if(element['SPI year'] === chosenYear) {
        result.push(element);
      }
    });
  });
  return result;
}

export async function makeYearsArray() {
  let years = [];
  await spi2020.then(function(data) {
    data.forEach((element) => {
      if(element['SPI year']) {
        if(!years.includes(element['SPI year'])) {
          years.push(element['SPI year']);
        }
      }
    });
  });
  return years;
}
export async function makeCountriesArray() {
  let countries = [];
  await spi2020.then(function(data) {
    data.forEach((element) => {
      if(element['Country']) {
        if(!countries.includes(element['Country'])) {
          countries.push(element['Country']);
        }
      }
    });
  });
  return countries;
}

export async function getSpiDataByYear(year) {
  return spi2020.then(function(data) {
    let result = data.filter(function(d) {
      return d['SPI year'] === year;
    });
    return result;
  });
}

export async function getSpiDataByCountry(data, countryValue) {
  let countries = d3.group(data, d => d['Country']);
  return countries.get(countryValue);
};

export async function getScore(ISO_A3, data) {
  var score = 'Score not Found';
  if(!data || data === undefined) {
    return 0;
  }
  data.filter((element) => {
    if(element['SPI country code'] === ISO_A3) {
      return score = element['Social Progress Index'];
    }
    else return 0;
  });
  return score;
}


export const colorScale = d3.scaleSequential()
.interpolator(d3.interpolateCubehelixLong("#c4c2c4", "#20c30f"))
.domain([0, 100]);

export const basicColorScale = d3.scaleSequential()
.interpolator(d3.interpolateRgb.gamma(2.2)("#ffffb0","#0310ff"))
// .interpolator(d3.interpolateYlGnBu)
.domain([0, 100]);

export const foundationsColorScale = d3.scaleSequential()
.interpolator(d3.interpolateRgb.gamma(2.2)("#ffffb0","#ff0000"))
// .interpolator(d3.interpolateYlOrRd)
.domain([0, 100]);

export const opportunityColorScale = d3.scaleSequential()
.interpolator(d3.interpolateRgb.gamma(2.2)("#ffffb0","#00ff00"))
// .interpolator(d3.interpolateYlGn)
.domain([0, 100]);



