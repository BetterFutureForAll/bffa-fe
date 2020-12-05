import { useState, useEffect, useRef } from 'react';
import { makeYearsArray, getScore, getSpiDataByYear } from '../services/SocialProgress';


export const useContent = () => {
  let [content, setContent] = useState('');
  return [content, setContent];
};

export const useYears = () => {
  let [years, setYears] = useState([]);
  useEffect(() => {
    if(years.length < 1 || !years) {
      makeYearsArray()
        .then(parsedYears => setYears(parsedYears))
    }
  }, [years]);
  return [years, setYears];
};

export const useHandleYearChange = () => {
  let [yearValue, setYearValue] = useState({ yearValue: '2020' });
  let handleYearChange = (e) => setYearValue({
    ...yearValue,
    yearValue: e
  })
  useEffect(() => {
    setYearValue(yearValue);
    console.log('chosen year = ' + yearValue)
  }, [yearValue])
  return [yearValue, handleYearChange];
};

export const useDataByYear = (year) => {
  let [spiByYear, setSpiByYear] = useState();
  useEffect(() => {
    if (!spiByYear) {
      getSpiDataByYear(year)
        .then(d => setSpiByYear(d))
    };
  }, [year, spiByYear])
  return [spiByYear, setSpiByYear];
};