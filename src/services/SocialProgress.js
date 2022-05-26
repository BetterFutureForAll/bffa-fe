import * as d3 from 'd3';

import logo from '../assets/bffa_icons/BFFA_Logo.png'
import basic_needs from '../assets/bffa_icons/0_0_basic.png';
import basic_nutrition from '../assets/bffa_icons/0_1_nutrition.png';
import basic_water from '../assets/bffa_icons/0_2_water.png';
import basic_shelter from '../assets/bffa_icons/0_3_shelter.png';
import basic_safety from '../assets/bffa_icons/0_4_safety.png';

import foundations from '../assets/bffa_icons/1_0_foundations.png';
import foundations_knowledge from '../assets/bffa_icons/1_1_knowledge.png';
import foundations_communication from '../assets/bffa_icons/1_2_communications.png';
import foundations_health from '../assets/bffa_icons/1_3_health.png';
import foundations_environmental from '../assets/bffa_icons/1_4_environmental.png';

import opportunity from '../assets/bffa_icons/2_0_opportunity.png';
import opportunity_rights from '../assets/bffa_icons/2_1_rights.png';
import opportunity_freedom from '../assets/bffa_icons/2_2_freedom.png';
import opportunity_inclusiveness from '../assets/bffa_icons/2_3_inclusiveness.png';
import opportunity_education from '../assets/bffa_icons/2_4_education.png';

export const imgImport = (d) => {
  switch (d) {
    case "Basic Human Needs": return basic_needs;
    case "Foundations of Wellbeing": return foundations;
    case "Opportunity": return opportunity;
    default: return logo;
  };
};

export const componentImgImport = (d) => {
  switch (d) {
    case "Nutrition and Basic Medical Care": return [basic_nutrition, 'Do people have enough food to eat and are they receiving basic medical care? '];
    case "Water and Sanitation": return [basic_water, 'Can people drink water and keep themselves clean without getting sick?'];
    case "Shelter": return [basic_shelter, 'Do people have adequate housing with basic utilities?'];
    case "Personal Safety": return [basic_safety, 'Do people feel safe?'];

    case "Access to Basic Knowledge": return [foundations_knowledge, 'Do people have access to an educational foundation?'];
    case "Access to Information and Communications": return [foundations_communication, 'Can people freely access ideas and in formation from anywhere in the world?'];
    case "Health and Wellness": return [foundations_health, 'Do people live long and healthy lives?'];
    case "Environmental Quality": return [foundations_environmental, 'Is this society using its resources so they will be available for future generations?'];

    case "Personal Rights": return [opportunity_rights, 'Are people’s rights as individuals protected?'];
    case "Personal Freedom and Choice": return [opportunity_freedom, 'Are people free to make their own life choices?'];
    case "Inclusiveness": return [opportunity_inclusiveness, 'Is no one excluded from the opportunity to be a contributing member of society?'];
    case "Access to Advanced Education": return [opportunity_education, 'Do people have access to the world’s most advanced knowledge?'];

    default: return [null, ''];
  };
};
let currentData = require('../assets/SPI2011-2021-dataset.csv');
let currentDefinitions = require('../assets/definitions-2021.csv')

export const parsedSpiData = d3.csv(currentData).then((data) => {
  return data;
});

export const parsedDefinitions = d3.csv(currentDefinitions).then((data) => {
  return data;
});

export async function makeDefinitions() {
  let definitionsData;
  await parsedDefinitions.then((data)=>{
    let group = d3.group(data, d => d["Dimension"], d => d["Component"], d => d['Indicator name']);
    definitionsData = Array.from(group).map(d=>{
      return d;
    })
  });
  return definitionsData;
}

export async function makeDimensions() {
  let dimensions;
  await parsedDefinitions.then(function (data) {
    let dimensionsGroup = d3.group(data, d => d["Dimension"]);
    dimensions = Array.from(dimensionsGroup).map(d => d[0]);
  });
  return dimensions;
}

export async function getComponentsByDimension(dimension) {
  let components;
  await parsedDefinitions.then(function (data) {
    let dimensionsGroup = d3.group(data, d => d["Dimension"], d => d["Component"]);
    let grouped = dimensionsGroup.get(dimension);
    components = Array.from(grouped).map(d=>d[0]);
    return components;
  });
}

export async function makeYearsArray() {
  let years;
  await parsedSpiData.then(function (data) {
    let yearsGroup = d3.group(data, d => d['SPI year']);
    years = Array.from(yearsGroup).map(d => d[0]);
  });
  return years;
}

export async function makeCountriesArray() {
  let countries;
  await parsedSpiData.then(function (data) {
    let countryGroup = d3.group(data, d => d['Country']);
    countries = Array.from(countryGroup).map(d => d[0])
  });
  return countries;
}

export async function getSpiDataByYear(year) {
  return parsedSpiData.then(function (data) {
    let yearsGroup = d3.group(data, d => d['SPI year'])
    let result = yearsGroup.get(year);
    return result;
  });
}

export async function getSpiDataByCountry(data, countryValue) {
  let countries = d3.group(data, d => d['Country'])
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



