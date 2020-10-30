import { getScore, getSpiDataByYear } from '../src/services/SocialProgress';
import * as allYears from '../src/assets/2011-2020-Social-Progress-Index.csv'


describe('Tests Functions on the SocialProgress.js services', () => {
  it('should get all the data for a specific year', () => {
    let year = '2020';
    let result = getSpiDataByYear(year);
    console.log(result);
    expect(result).toBeDefined();
    
  });



});