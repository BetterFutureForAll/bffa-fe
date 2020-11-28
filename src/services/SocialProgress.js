import * as csvData from '../assets/2019-global.csv';  //Change csvData to 2019
import * as d3 from 'd3';
import * as allYears from '../assets/2011-2020-Social-Progress-Index.csv';
import * as csvDefinitions from '../assets/definitions.csv';


// this has access to SPI data

// Columns ['SPI Rank', 'Country', 'SPI country code', 'SPI year', 'Status', 'Social Progress Index']

export const spiData = d3.csv(csvData, function (d) {
  return d;
});
export const definitions = d3.csv(csvDefinitions, function (d) {
  return d;
});

export const spi2020 = d3.csv(allYears, function (d) {
  return d;
});

export function byYear(chosenYear) {
  let result = []
  d3.csv(allYears, function (data) {
    // var allGroup = d3.map(data, function(d){return(d['SPI year'])}).keys()

    // nest each 'SPI year', then d3 rollup to select them as an object

    data.forEach((element, i) => {
      console.log(element);
      if (element['SPI year'] === chosenYear) {
        result.push(element)
      };
    });
  });
  return result;
};

export async function makeYearsArray() {
  let years = [];
  // await byYear('2020').then((x) => console.log('nested data = ' + x));
  await spi2020.then(x => console.log(x));
  await spi2020.then(function (data) {
    data.forEach((element, i) => {
      if (element['SPI year']) {
        if (!years.includes(element['SPI year'])) {
          years.push(element['SPI year']);
        };
      };
    });
  });
  console.log('years =' + years);
  return years;
};


export async function getSpiDataByYear(year) {

  await spi2020.then(function (data) {
    let result = [];
    data.forEach((d, i) => {
      if (d['SPI year'] === year) {
        result.push(d);
      };
    });
    return result;
  });
};

// Set data to State eventually to keep in React thinking, maybe add Redux? (MapChart uses Memo)
// spiData().then((data) => {
//   this.setState({ spi: data });
// });

// loop, map, or build a reducer to set the SPI data for Name = spitData.Country
export function getScore(name, longName, spiData) {
  return spiData.then(function (data) {
    var score = 'Score not Found';
    //Need to find a better Name matcher
    data.forEach((element, i) => {
      if (element.Country === name || element.Country === longName) {
        return score = element["Social Progress Index"];
      };
    });
    return score;
  });
};

