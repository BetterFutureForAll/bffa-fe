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

function scoreToColor(score) {
  var r, g, b = 0;
  if (score < 50) {
    r = 255;
    g = Math.round(5.1 * score);
  }
  else {
    g = 255;
    r = Math.round(510 - 5.10 * score);
  }
  var h = r * 0x10000 + g * 0x100 + b * 0x1;
  return '#' + ('000000' + h.toString(16)).slice(-6);
};

export const colorMaker = () => {
  let score = '30';
  let color = scoreToColor(score);
  let coloredStyle = {
    default: {
      fill: `${color}`,
      outline: "none"
    },
    hover: {
      fill: "#F53",
      outline: "none"
    },
    pressed: {
      fill: "#E42",
      outline: "none"
    }
  };
  return coloredStyle;
};