import * as d3 from 'd3';
import * as allYears from '../assets/2011-2020-Social-Progress-Index.csv';
import * as csvDefinitions from '../assets/definitions.csv';

// Columns ['SPI Rank', 'Country', 'SPI country code', 'SPI year', 'Status', 'Social Progress Index']

export const definitions = d3.csv(csvDefinitions, function(d) {
  return d;
});

export const spi2020 = d3.csv(allYears, function(d) {
  return d;
});

export function byYear(chosenYear) {
  let result = [];
  d3.csv(allYears, function(data) {
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

export async function getSpiDataByYear(year) {
  return spi2020.then(function(data) {
    let result = data.filter(function(d) {
      return d['SPI year'] === year;
    });
    return result;
  });
}

export async function getScore(NAME, ISO_A3, data) {
  var score = 'Score not Found';
  data.filter((element) => {
    if(element['SPI country code'] === ISO_A3 || element.Country === NAME) {
      return score = element['Social Progress Index'];
    }
    return score;
  });
  return score;
}

