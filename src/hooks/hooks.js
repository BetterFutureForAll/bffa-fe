import { useState, useEffect } from 'react';


export const useContent = () => {
  let [content, setContent] = useState('');
};

export const useYears = () => {
  let [years, setYears ] = useState([]);
  useEffect(()=> {
    makeYearsArray()
      .then(parsedYears => setYears(parsedYears))
  }, []);
  return years;
};