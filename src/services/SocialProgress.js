import * as csvData from '../assets/2019-global.csv';  //Change csvData to 2019
import * as d3 from 'd3';
import * as allYears from '../assets/2011-2020-Social-Progress-Index.csv';
import * as csvDefinitions from '../assets/definitions.csv';


// this has access to SPI data

// Columns ['SPI Rank', 'Country', 'SPI country code', 'SPI year', 'Status', 'Social Progress Index']

export const spiData = d3.csv(csvData, function(d){
  return d;
});
export const definitions = d3.csv(csvDefinitions, function(d){
  return d;
});

export const spi2020 = d3.csv(allYears, function(data) {
  console.log(data);
  return data;
  // let byCountry = data.sort(function (a,b) {
  //   return d3.ascending(a['Country'], b['Country']);
  // });
});


export const getSpiDataByYear = (year) => {
  return spi2020.then((data)=> {
      console.log(data);
      data.forEach((d) => {
        if(d['SPI year'] === year) {
          return d;
        };
        return d;
      });
    });
};

// Set data to State eventually to keep in React thinking, maybe add Redux? (MapChart uses Memo)
// spiData().then((data) => {
//   this.setState({ spi: data });
// });

// loop, map, or build a reducer to set the SPI data for Name = spitData.Country
export function getScore(name, longName, spiData) {
  return spiData.then(function(data) {
    var score = 'Score not Found';
    //Need to find a better Name matcher
    data.forEach((element, i) => { 
      if(element.Country === name || element.Country === longName) {
        return score = element["Social Progress Index"];
      };
      return score;
    });
    return score;
  });
};

