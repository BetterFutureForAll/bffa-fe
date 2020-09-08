import * as csvData from '../assets/2019-global.csv';
import * as d3 from 'd3';

// this has access to SPI data, need to link data.Country to NAME, then attach the Social Progress Index score to its corresponding GeoLocation
export const spiData = d3.csv(csvData, function(d) {
    return d;
  });

//   EXAMPLE FROM D3 DOC's
// d3.csv("/data/cities.csv", function(d) {
//   return {
//     city : d.city,
//     state : d.state,
//     population : +d.population,
//     land_area : +d["land area"]
//   };
// }).then(function(data) {
//   console.log(data[0]);
// });

// Set data to State eventually to keep in React thinking, maybe add Redux? (MapChart uses Memo)
// spiData().then((data) => {
//   this.setState({ spi: data });
// });

// loop, map, or build a reducer to set the SPI data for Name = spitData.Country
export function getScore(name, spiData) {
  return spiData.then(function(data) {
    var score = 'Score not Found';
    //Need to find a better Name matcher
    console.log(name);
    data.forEach((element, i) => { 
      if(element.Country === name) {
        return score = element["Social Progress Index"];
      };
      return score;
    });
    console.log(score);
    return score;
  });
};

