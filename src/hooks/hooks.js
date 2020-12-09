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
  let [yearValue, setYearValue] = useState("2020");
  let handleYearChange = (e) => setYearValue(e.target.value)
  useEffect(() => {
    setYearValue(yearValue);
    console.log('chosen year = ' + yearValue);
  }, [yearValue])
  return [yearValue, handleYearChange];
};

export const useDataByYear = (yearValue) => {
  let [spiByYear, setSpiByYear] = useState(null);
  useEffect(() => {
      getSpiDataByYear(yearValue)
        .then(d => setSpiByYear(d))
  }, [yearValue])
  console.log('SPI data changed to ' + yearValue);
  console.log(spiByYear);
  return [spiByYear, setSpiByYear];
};