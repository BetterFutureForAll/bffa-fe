import * as d3 from 'd3';
import { data } from '../assets/spi.json';
import { countryIdTable } from '../assets/iso.json';

export const keyFixer = (key) => key.replace(/[\n\r]*\((.*)\)[ \n\r]*/g, '');
export const nameFixer = (name) => name.replace(/,\s*|\s+/g, '_').toLowerCase();

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

// Define the scales and color scales outside of the function
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


const spiScale = d3.scaleLinear().domain([0, 100]).range([0, 100]);

// Define a function that creates a petal object
function createPetal(label, score, colorScale, angle, subPetals) {
  const scale = spiScale(score || 0);
  const color = colorScale(score || 0);
  const petalPath = 'M 0 0 c 100 100 80 0 100 0 C 80 0 100 -100 0 0';

  return { label, score, scale, color, petalPath, angle, subPetals };
}

// Define the parsedData function using the createPetal function
export function parsedTooltipData(d) {
  const name = d.country;
  const id = d.spicountrycode;
  const score = d.score_spi;

  const basics = createPetal(
    'Basic Human Needs', d.score_bhn, basicColorScale, 30,
    [
      createPetal('Nutrition and Basic Medical Care', d.score_nbmc, basicColorScale, 0),
      createPetal('Water and Sanitation', d.score_watsan, basicColorScale, 20),
      createPetal('Shelter', d.score_shel, basicColorScale, 40),
      createPetal('Personal Safety', d.score_ps, basicColorScale, 60),
    ],
  );

  const foundations = createPetal(
    'Foundations of Wellbeing', d.score_fow, foundationsColorScale, 150,
    [
      createPetal('Access to Basic Knowledge', d.score_abk, foundationsColorScale, 120),
      createPetal('Access to Information and Communications', d.score_aic, foundationsColorScale, 140),
      createPetal('Health and Wellness', d.score_hw, foundationsColorScale, 160),
      createPetal('Environmental Quality', d.score_eq, foundationsColorScale, 180),
    ],
  );

  const opportunity = createPetal(
    'Opportunity', d.score_opp, opportunityColorScale, 270,
    [
      createPetal('Personal Rights', d.score_pr, opportunityColorScale, 240),
      createPetal('Personal Freedom and Choice', d.score_pfc, opportunityColorScale, 260),
      createPetal('Inclusiveness', d.score_inc, opportunityColorScale, 280),
      createPetal('Access to Advanced Education', d.score_aae, opportunityColorScale, 300),
    ],
  );

  return [{name, id, score, petals:[basics, foundations, opportunity]}];
}

export function getParsedTooltipData(d) {
  return new Promise((resolve, reject) => {
    const data = parsedTooltipData(d);
    resolve(data);
  });
}


// let spiScale = d3.scaleLinear().domain([0, 100]).range([0, 100]);
// let petalPath = 'M 0 0 c 100 100 80 0 100 0 C 80 0 100 -100 0 0';
// let subPetalPath = "M 0 0 L 85 15 A 1 1 0 0 0 85 -15 L 0 0";

// function parsedData(d) {
//   let basics = Object.assign({},
//     { "Basic Human Needs": d.score_bhn },
//     { scale: spiScale(d.score_bhn || 0) },
//     { color: basicColorScale(d.score_bhn || 0) },
//     {
//       subPetals:
//         [
//           { "Nutrition and Basic Medical Care": d.score_nbmc, colorFn: basicColorScale, angle: 0 },
//           { 'Water and Sanitation': d.score_nbmc, colorFn: basicColorScale, angle: 20 },
//           { 'Shelter': d.score_nbmc, colorFn: basicColorScale, angle: 40 },
//           { 'Personal Safety': d.score_ps, colorFn: basicColorScale, angle: 60 }
//         ]
//     },
//     { angle: 30 });

//   let foundations = Object.assign({},
//     { "Foundations of Wellbeing": d.score_fow },
//     { scale: spiScale(d.score_fow || 0) },
//     { color: foundationsColorScale(d.score_fow || 0) },
//     {
//       subPetals:
//         [
//           { "Access to Basic Knowledge": d.score_abk, colorFn: foundationsColorScale, angle: 120 },
//           { 'Access to Information and Communications': d.score_abk, colorFn: foundationsColorScale, angle: 140 },
//           { 'Health and Wellness': d.score_hw, colorFn: foundationsColorScale, angle: 160 },
//           { 'Environmental Quality': d.score_eq, colorFn: foundationsColorScale, angle: 180 }
//         ]
//     },
//     { angle: 150 });

//   let opportunity = Object.assign({},
//     { "Opportunity": d.score_opp },
//     { scale: spiScale(d.score_opp || 0) },
//     { color: opportunityColorScale(d.score_opp || 0) },
//     {
//       subPetals:
//         [
//           { 'Personal Rights': d.score_pr, colorFn: opportunityColorScale, angle: 240 },
//           { "Personal Freedom and Choice": d.score_pr, colorFn: opportunityColorScale, angle: 260 },
//           { 'Inclusiveness': d.score_incl, colorFn: opportunityColorScale, angle: 280 },
//           { 'Access to Advanced Education': d.score_aae, colorFn: opportunityColorScale, angle: 300 }
//         ]
//     },
//     { angle: 270 });

//   let result = Object.assign({}, d, { petals: [basics, foundations, opportunity] })
//   return [result];
// }
