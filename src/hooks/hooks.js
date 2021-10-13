import { useState, useEffect } from 'react';
import {
  makeYearsArray,
  getSpiDataByYear,
  makeCountriesArray,
  getSpiDataByCountry
} from '../services/SocialProgress';
import * as d3 from 'd3';

export const useContent = () => {
  let [content, setContent] = useState('');
  return [content, setContent];
};

export const useModal = () => {
  let [showModal, setModal] = useState(false);
  function toggleModal() {
    setModal(!showModal);
  }
  return {
    showModal,
    toggleModal
  };
}

export const useClicked = () => {
  let [clicked, setClicked] = useState('World');
  useEffect(()=>{
    setClicked(clicked);
  },[clicked])
  return [clicked, setClicked];
}

export const useClickedSubCat = () => {
  let [clickedSubCat, setClickedSubCat] = useState(null);
  useEffect(()=>{
    setClickedSubCat(clickedSubCat);
  },[clickedSubCat])
  return [clickedSubCat, setClickedSubCat];
}

export const useMouse = () => {
  let [mouse, setMouse] = useState('World');
  return [mouse, setMouse];
}

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

export const useCountries = () => {
  let [countries, setCountries] = useState(["World"]);
  useEffect(() => {
    if (countries.length < 2 || !countries) {
      makeCountriesArray()
        .then(parsedCountries => setCountries(parsedCountries));
    }
  }, [countries]);
  return [countries, setCountries];
};

export const useHandleCountryChange = () => {
  let [countryValue, setCountryValue] = useState('World');
  let handleCountryChange = (e) => {
    setCountryValue(e.target.value);
  };
  useEffect(() => {
    setCountryValue(countryValue);
    console.log(countryValue);
    
  }, [countryValue]);
  return [countryValue, handleCountryChange, setCountryValue];
};

export const useDataByYear = (yearValue) => {
  let [spiByYear, setSpiByYear] = useState([]);
  useEffect(() => {
    getSpiDataByYear(yearValue)
      .then(d => setSpiByYear(d));
  }, [yearValue]);
  return [spiByYear, setSpiByYear];
};

export const useDataByCountry = (spiByYear, countryValue) => {
  let [spiByCountry, setSpiByCountry] = useState([]);
  useEffect(() => {
    if (spiByYear && countryValue) {
      getSpiDataByCountry(spiByYear, countryValue)
        .then(d => setSpiByCountry(d));
    }
  }, [spiByYear, countryValue]);
  return [spiByCountry, setSpiByCountry];
};

export function scoreToColor(score) {
  let scoreColor = d3.scaleLinear()
    .domain([0, 20, 40, 60, 80, 100])
    .range([
      '#c4c2c4',
      // '#f64c5c',
      '#c574fb',
      '#7484fb',
      '#00e4fb',
      '#00eb9b',
      '#20c30f'
    ]);
  return scoreColor(score);
}

export function useWindowSize() {
  const isWindowClient = typeof window === "object";

  const [windowSize, setWindowSize] = useState(
    isWindowClient ? [window.innerWidth, window.innerHeight] : undefined
  );

  useEffect(() => {
    //a handler which will be called on change of the screen resize
    function setSize() {
      setWindowSize([window.innerWidth, window.innerHeight]);
    }
    if (isWindowClient) {
      //register the window resize listener
      window.addEventListener("resize", setSize);

      //un-register the listener
      return () => window.removeEventListener("resize", setSize);
    }
  }, [isWindowClient, setWindowSize]);

  return windowSize;
};

