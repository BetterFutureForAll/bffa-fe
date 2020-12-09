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
  return spi2020.then(function (data) {
    let result = data.filter(function (d) {
      //currently hard coded for 2020, change to {year}
      return d['SPI year'] === year
    });
    console.log(result);
    return result;
  });
};

// Set data to State eventually to keep in React thinking, maybe add Redux? (MapChart uses Memo)
// spiData().then((data) => {
//   this.setState({ spi: data });
// });

export async function getScore(NAME, ISO_A3, data) {
  console.log(data, ISO_A3);
  var score = 'Score not Found';
  data.filter((element, i) => {
    if (element["SPI country code"] === ISO_A3 || element.Country === NAME) {
      console.log(element);
      return score = element["Social Progress Index"];
    };
  });
  console.log(score);
  return score;
};

