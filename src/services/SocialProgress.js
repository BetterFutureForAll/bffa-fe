import * as csvData from '../assets/2019-global.csv';  //Change csvData to 2019
import * as d3 from 'd3';

// this has access to SPI data, need to link data.Country to NAME, then attach the Social Progress Index score to its corresponding GeoLocation
export const spiData = d3.csv(csvData, function(d) {
    return d;
  });
  
// spiData = getDataForYear(year){};


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

