import { useState, useEffect } from 'react';
import { makeYearsArray, getSpiDataByYear } from '../services/SocialProgress';
import * as d3 from 'd3';

export const useContent = () => {
  let [content, setContent] = useState('');
  return [content, setContent];
};

export const useScore = () => {
  let [score, setScore] = useState({ name: '', score: '' });
  return [score, setScore];
};

export const useYears = () => {
  let [years, setYears] = useState([]);
  useEffect(() => {
    if(years.length < 1 || !years) {
      makeYearsArray()
        .then(parsedYears => setYears(parsedYears));
    }
  }, [years]);
  return [years, setYears];
};

export const useHandleYearChange = () => {
  let [yearValue, setYearValue] = useState('2020');
  let handleYearChange = (e) => {
    setYearValue(e.target.value);
  };
  useEffect(() => {
    setYearValue(yearValue);
  }, [yearValue]);
  return [yearValue, handleYearChange];
};

export const useDataByYear = (yearValue) => {
  let [spiByYear, setSpiByYear] = useState([]);
  useEffect(() => {
    getSpiDataByYear(yearValue)
      .then(d => setSpiByYear(d));
  }, [yearValue]);
  return [spiByYear, setSpiByYear];
};

export function scoreToColor(score) {
  let scoreColor = d3.scaleLinear()
    .domain([0, 0, 100])
    .range([
      'c4c2c4',
      '#a8ddb5',
      '#7bccc4',
      '#ccebc5',
      '#4eb3d3',
      '#2b8cbe',
      '#08589e',
    ]);

  return scoreColor(score);
}


// export const colorMaker = () => {
//   const { NAME, ISO_A3 } = geo.properties;
//   let color = getScore(NAME, ISO_A3, data).then((SCORE) =>
//   scoreToColor(SCORE));
//   let coloredStyle = {
//     default: {
//       fill: `${color}`,
//       outline: "none"
//     },
//     hover: {
//       fill: "#F53",
//       outline: "none"
//     },
//     pressed: {
//       fill: "#E42",
//       outline: "none"
//     }
//   };
//   return coloredStyle;
// };
