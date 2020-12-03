import { useState, useEffect } from 'react';
import { makeYearsArray } from '../services/SocialProgress';


export const useContent = () => {
  let [content, setContent] = useState('');
  return [content, setContent];
};

export const useYears = () => {
  let [years, setYears ] = useState([]);
  useEffect(()=> {
    if(years.length < 1 || !years ) {
      makeYearsArray()
        .then(parsedYears => setYears(parsedYears))
    }
  }, [years]);
  return [years, setYears];
};

export const useHandleYearChange = () => {
  let [yearValue, setYearValue] = useState('2020');
  let handleYearChange = (yearValue) => setYearValue(yearValue);
  useEffect(()=> {
    console.log('chosen year = ' + yearValue)
    handleYearChange(yearValue)
  }, [yearValue])
  return [yearValue, handleYearChange];
};