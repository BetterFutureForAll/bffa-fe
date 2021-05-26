import { useState, useEffect, useCallback } from 'react';
import { 
        makeYearsArray,
        getSpiDataByYear, 
        makeCountriesArray, 
        getSpiDataByCountry 
      } 
from '../services/SocialProgress';
import * as d3 from 'd3';

export const useContent = () => {
  let [content, setContent] = useState('');
  return [content, setContent];
};

export const useClicked = () => {
  let [clicked, setClicked] = useState('World');
  return [clicked, setClicked];
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
    if(countries.length < 2 || !countries) {
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
  }, [countryValue]);
  return [countryValue, handleCountryChange];
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
    if(spiByYear && countryValue) {
      getSpiDataByCountry(spiByYear, countryValue)
        .then(d => setSpiByCountry(d));
    }
    }, [spiByYear, countryValue]);
  return [spiByCountry, setSpiByCountry];
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
    isWindowClient ? window.innerWidth : undefined
  );

  useEffect(() => {
    //a handler which will be called on change of the screen resize
    function setSize() {
      setWindowSize(window.innerWidth);
    }
    console.log("windowSize Change");
    if (isWindowClient) {
      //register the window resize listener
      window.addEventListener("resize", setSize);

      //un-register the listener
      return () => window.removeEventListener("resize", setSize);
    }
  }, [isWindowClient, setWindowSize]);

  return windowSize;
};



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