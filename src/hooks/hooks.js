import { useState, useEffect, useRef, useCallback } from 'react';
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
    if (years.length < 1 || !years) {
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

export const useLoopAnimator = (yearsArr) => {
  let [animatedYears, setAnimatedYears] = useState('2020');
  
  let loopWrapper = useCallback(() => {
    function yearLoop() {
      var i = 1;
      setTimeout(function () {
        //  increment the counter
        i++;
        if (i < yearsArr.length) {
          yearLoop();
        }
        //  ..  setTimeout()
      }, 1500);
    }
    yearLoop();
  }, [yearsArr]);
  
  useEffect(() => {
    let handleAnimationChange = () => {
      loopWrapper(yearsArr);
      setAnimatedYears(loopWrapper);
    };
    handleAnimationChange(animatedYears);
  }, [animatedYears, loopWrapper, yearsArr]);
  return [animatedYears];
};

export function scoreToColor(score) {
  // console.log('data = ' + data['Social Progress Index']);
  // console.log('Score = ' + score);
  let scoreColor = d3.scaleLinear()
    .domain([0, 20, 40, 60, 80, 90, 100])
    .range([
      '#c4c2c4',
      '#f64c5c',
      '#c574fb',
      '#7484fb',
      '#00e4fb',
      '#00eb9b',
      '#20c30f'
    ]);
  return scoreColor(score);
}


//Green: #90eb00
//Blue:#00e4fb
//Red: #f64c5c

// '#c4c2c4',
// '#ffe479',
// // '#ccebc5',
// '#a8ddb5',
// '#7bccc4',
// '#4eb3d3',
// // '#2b8cbe',
// '#08589e',

// #f64c5c,
// #c574fb,
// #7484fb,
// #00e4fb,
// #00eb9b,
// #90eb00