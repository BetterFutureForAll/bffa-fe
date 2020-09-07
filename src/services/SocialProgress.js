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
export const getScore = (name, spiData) => {
  var score = spiData.then(function(data) {
    data.forEach((element, i) => { 
      console.log(element.Country);
      console.log(name);
      if(name===data[i].Country) {
        return data[i]["Social Progress Index"];
      };
      return 'Score not found';
    });
  });
  console.log(score);
  return score;
};

