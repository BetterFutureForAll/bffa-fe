import * as d3 from 'd3';
import { useMemo } from 'react';
import data from '../assets/spi.json';
import { countryIdTable } from '../assets/iso.json';
import definitionsArray from '../assets/definitions.json';

export const keyFixer = (key) => key.replace(/[\n\r]*\((.*)\)[ \n\r]*/g, '');
export const nameFixer = (name) => name.replace(/,\s*|\s+/g, '_').toLowerCase();

export const promisedMap = d3.json("https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json")
  .then(data => {
    data.objects.countries.geometries.forEach((r) => {
      var result = countryIdTable.filter(function(iso) {
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
  if(!found) return;
  const output = Object.keys(found).reduce((previous, key) => {
    return { ...previous, [`${keyFixer(key)}`]: found[key] };
  }, {});

  return [output];
};

export async function getScore(ISO_A3, data) {
  var score = null;
  if(!data || data === undefined) {
    return 0;
  }
  data.filter((element) => {
    if(element['SPI country code'] === ISO_A3) {
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
export function parseTooltipData(d) {
  if(!d) return null;
  const name = d.country;
  const id = d.spicountrycode;
  const score = +d.score_spi || 0;

  const basics = createPetal(
    'Basic Needs', +d.score_bhn || 0, basicColorScale, 30,
    [
      createPetal('Nutrition and Medical Care', +d.score_nbmc || 0, basicColorScale, 0),
      createPetal('Water and Sanitation', +d.score_ws || 0, basicColorScale, 20),
      createPetal('Housing', +d.score_sh || 0, basicColorScale, 40),
      createPetal('Safety', +d.score_ps || 0, basicColorScale, 60),
    ],
  );

  const foundations = createPetal(
    'Foundations of Wellbeing', +d.score_fow || 0, foundationsColorScale, 150,
    [
      createPetal('Basic Education', +d.score_abk || 0, foundationsColorScale, 120),
      createPetal('Information and Communications', +d.score_aic || 0, foundationsColorScale, 140),
      createPetal('Health', +d.score_hw || 0, foundationsColorScale, 160),
      createPetal('Environmental Quality', +d.score_eq || 0, foundationsColorScale, 180),
    ],
  );

  const opportunity = createPetal(
    'Opportunity', +d.score_opp || 0, opportunityColorScale, 270,
    [
      createPetal('Rights and Voice', +d.score_pr || 0, opportunityColorScale, 240),
      createPetal('Freedom and Choice', +d.score_pfc || 0, opportunityColorScale, 260),
      createPetal('Inclusive Society', +d.score_incl || 0, opportunityColorScale, 280),
      createPetal('Advanced Education', +d.score_aae || 0, opportunityColorScale, 300),
    ],
  );

  return { name, id, score, petals: [basics, foundations, opportunity] };
}

export function useParsedCitations() {
  const parsedDefinitions = useMemo(() => {
    return definitionsArray.map(data => {
      // Make a citation Array for indicators with multiple sources
      let links = data.link.split(/\r?\n/);
      let sources = data.source.split(/;/);
      if(links.length === 0) return data;
      let result = links.map((link, i) => ({ citation: [link, sources[i]] }));
      return { ...data, citations: result };
    });
  }, []);
  return parsedDefinitions;
}

export function componentQuestionMatch(d) {
  switch(d[0]) {

    case 'Nutrition and Medical Care': return 'Do people have enough food to eat and are they receiving basic medical care? ';
    case 'Water and Sanitation': return 'Can people drink water and keep themselves clean without getting sick?';
    case 'Housing': return 'Do people have adequate housing with basic utilities?';
    case 'Safety': return 'Do people feel safe?';

    case "Basic Education": return 'Do people have access to an educational foundation?';
    case "Information and Communications": return 'Can people freely access ideas and in formation from anywhere in the world?';
    case "Health": return 'Do people live long and healthy lives?';
    case "Environmental Quality": return 'Is this society using its resources so they will be available for future generations?';

    case "Rights and Voice": return 'Are people’s rights as individuals protected?';
    case "Freedom and Choice": return 'Are people free to make their own life choices?';
    case "Inclusive Society": return 'Is no one excluded from the opportunity to be a contributing member of society?';
    case "Advanced Education": return 'Do people have access to the world’s most advanced knowledge?';

    default: return '';
  };
};