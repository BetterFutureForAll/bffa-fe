import * as csvData from '../assets/2019-global.csv';
import * as d3 from 'd3';

// this has access to SPI data, need to link data.Country to NAME, then attach the Social Progress Index score to its corresponding GeoLocation
export const spiData = d3.csv(csvData,function (data) {
  console.log(data)
  return data;
  //returns a promise
});

// Set data to State eventually to keep in React thinking, maybe add Redux? (MapChart uses Memo)
// spiData().then((data) => {
//   this.setState({ spi: data });
// });

// loop, map, or build a reducer to set the SPI data for Name = spitData.Country
export const getScore = (name, spiData) => {
  console.log(name);
  console.log(spiData);
  return 'score not found';
};

  //spiData comes in as a promise, need to await and use it as an array for this step.
  // spiData.map(Name => {
  //   if(Name===spiData.Country) {
  //     console.log(spiData.Country)
  //     return spiData.Country.SPI;
  //   }
  //   else return 'SPI not found';
  // }) 

// Example from MusicSearch (Our data is CSV not JSON)
  // return fetch(url)
  // .then(res => res.json())
  // .then(({ lyrics }) => {
  //   if(lyrics) return lyrics;
  //   else return 'No Lyrics Found';
  // })
  // .catch(error => {
  //   console.log(error);
  // });

