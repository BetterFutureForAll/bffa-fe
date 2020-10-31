import { spiData, spi2020, getScore, getSpiDataByYear } from '../services/SocialProgress';
import * as d3 from 'd3';


describe('Tests Functions on the SocialProgress.js services', () => {

  it('should get all the data for a specific year', () => {
    let year = '2020';
    let result = getSpiDataByYear(year);
    Promise.resolve(result).then((r)=>console.log(r));
    expect(Promise.resolve(result)).toBeUndefined();
  });

  it('Should return an Object with the full SPI data', () => {
    console.log(spi2020);
    expect(spi2020).toBeDefined();
  });



});