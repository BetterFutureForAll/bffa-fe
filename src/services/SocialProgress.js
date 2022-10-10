import * as d3 from 'd3';

let currentData = require('../assets/SPI2011-2021-dataset.csv');
let data2022 = require('../assets/spi2022.csv');

export const parsedSpiData = d3.csv(data2022).then((data) => {
  let cleanData = data.filter((d, i)=>{ return (i !== 0); });
  return cleanData;
});

export async function makeYearsArray() {
  let years;
  await parsedSpiData.then(function (data) {
    let yearsGroup = d3.group(data, d => d['spiyear']);
    years = Array.from(yearsGroup).map(d => d[0]);
  });
  console.log(years);
  return years;
}
export async function makeCountriesArray() {
  let countries;
  await parsedSpiData.then(function (data) {
    let countryGroup = d3.group(data, d => d['country']);
    countries = Array.from(countryGroup).map(d => d[0])
  });
  return countries;
}

export async function getSpiDataByYear(year) {
  return parsedSpiData.then(function (data) {
    let yearsGroup = d3.group(data, d => d['spiyear'])
    let result = yearsGroup.get(year);
    return result;
  });
}

export async function getSpiDataByCountry(data, countryValue) {
  let countries = d3.group(data, d => d['country'])
  let result = countries.get(countryValue);
  if (!result) return;
  let input = result[0];
  const keyFixer = (key) => key.replace(/[\n\r]*\((.*)\)[ \n\r]*/g, '')

  const output = Object.keys(input).reduce((previous, key) => {
    return { ...previous, [`${keyFixer(key)}`]: input[key] };
  }, {});

  return [output];
};

export async function getScore(ISO_A3, data) {
  var score = 'Score not Found';
  if (!data || data === undefined) {
    return 0;
  }
  data.filter((element) => {
    if (element['SPI country code'] === ISO_A3) {
      return score = element['Social Progress Index'];
    }
    else return 0;
  });
  return score;
}

export const colorScale = d3.scaleSequential()
  .interpolator(d3.interpolateCubehelixLong("#c4c2c4", "#20c30f"))
  .domain([0, 100]);

export const basicColorScale = d3.scaleSequential()
  .interpolator(d3.interpolateRgb.gamma(2.2)("#ffffb0", "#0310ff"))
  // .interpolator(d3.interpolateYlGnBu)
  .domain([0, 100]);

export const foundationsColorScale = d3.scaleSequential()
  .interpolator(d3.interpolateRgb.gamma(2.2)("#ffffb0", "#ff0000"))
  // .interpolator(d3.interpolateYlOrRd)
  .domain([0, 100]);

export const opportunityColorScale = d3.scaleSequential()
  .interpolator(d3.interpolateRgb.gamma(2.2)("#ffffb0", "#00ff00"))
  // .interpolator(d3.interpolateYlGn)
  .domain([0, 100]);



