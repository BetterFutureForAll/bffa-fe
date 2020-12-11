import { useState, useEffect } from 'react';
import { makeYearsArray, getSpiDataByYear } from '../services/SocialProgress';


export const useContent = () => {
  let [content, setContent] = useState('');
  return [content, setContent];
};

export const useYears = () => {
  let [years, setYears] = useState([]);
  useEffect(() => {
    if (years.length < 1 || !years) {
      makeYearsArray()
        .then(parsedYears => setYears(parsedYears))
    }
  }, [years]);
  return [years, setYears];
};

export const useHandleYearChange = () => {
  let [yearValue, setYearValue] = useState("2020");
  let handleYearChange = (e) => {
    setYearValue(e.target.value);
  }
  useEffect(() => {
    setYearValue(yearValue);
    console.log('chosen year = ' + yearValue);
  }, [yearValue])
  return [yearValue, handleYearChange];
};

export const useDataByYear = (yearValue) => {
  let [spiByYear, setSpiByYear] = useState({});
  useEffect(() => {
    getSpiDataByYear(yearValue)
      .then(d => setSpiByYear(d))
    }, [yearValue])
  return [spiByYear, setSpiByYear];
};