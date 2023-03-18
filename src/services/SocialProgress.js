import * as d3 from 'd3';
import { data } from '../assets/spi.json';
import { countryIdTable } from '../assets/iso.json';

const keyFixer = (key) => key.replace(/[\n\r]*\((.*)\)[ \n\r]*/g, '');

export const promisedMap = d3.json("https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json")
.then(data => {
  data.objects.countries.geometries.forEach((r) => {
    var result = countryIdTable.filter(function (iso) {
      return iso['country-code'] === r.id;
    });
    // assign an ISO-Alpha to each country geometry 
    r.properties['mapId'] = (result[0] !== undefined) ? result[0]["alpha-3"] : null;
  })
  return data;
});

export const dataKeys = data[0];
export const dataValues = data.slice(1);

const yearsGroup = d3.group(dataValues, d => d['spiyear']);
const countryGroup = d3.group(dataValues, d => d['country']);

export async function makeYearsArray() {
  let years = Array.from(yearsGroup).map(d => d[0]);
  return years;
}

export async function makeCountriesArray() {
  let countries = Array.from(countryGroup).map(d => d[0])
  return countries;
}

export async function getSpiDataByYear(year) {
  let result = yearsGroup.get(year);
  return result;
};

export async function getSpiDataByCountry(data, countryValue) {
  let found = data.find(d => d.country === countryValue)
  if (!found) return;
  const output = Object.keys(found).reduce((previous, key) => {
    return { ...previous, [`${keyFixer(key)}`]: found[key] };
  }, {});

  return [output];
};

export async function getScore(ISO_A3, data) {
  var score = null;
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
  .domain([0, 100]);

export const foundationsColorScale = d3.scaleSequential()
  .interpolator(d3.interpolateRgb.gamma(2.2)("#ffffb0", "#ff0000"))
  .domain([0, 100]);

export const opportunityColorScale = d3.scaleSequential()
  .interpolator(d3.interpolateRgb.gamma(2.2)("#ffffb0", "#00ff00"))
  .domain([0, 100]);



