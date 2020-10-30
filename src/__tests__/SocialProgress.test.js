import { spiData, getScore, getSpiDataByYear } from '../services/SocialProgress';
import * as allYears from '../assets/2011-2020-Social-Progress-Index.csv';
import * as d3 from 'd3';


describe('Tests Functions on the SocialProgress.js services', () => {
  let spiData = d3.csv(allYears, (d)=> {
    return d
  }); 

  it('should get all the data for a specific year', () => {
    let year = '2020';
    let result = getSpiDataByYear(year);
    Promise.resolve(result).then((r)=>console.log(r));
    expect(Promise.resolve(result)).toBeUndefined();
  });



});