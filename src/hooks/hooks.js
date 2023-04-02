import { useState, useEffect, useCallback } from 'react';
import {
  makeYearsArray,
  getSpiDataByYear,
  makeCountriesArray,
  getSpiDataByCountry,
  parseTooltipData
} from '../services/SocialProgress';
import * as d3 from 'd3';

export const useClicked = () => {
  let [clicked, setClicked] = useState(null);
  useEffect(() => {
    setClicked(clicked);
  }, [clicked])
  return [clicked, setClicked];
}
export const useLoading = () => {
  let [loading, setLoading] = useState(true);
  const setLoadingCallback = useCallback((t) => {
    setLoading(t);
  }, []);
  return [loading, setLoadingCallback];
}

export const useClickedSubCat = () => {
  let [clickedSubCat, setClickedSubCat] = useState(null);
  useEffect(() => {
    setClickedSubCat(clickedSubCat);
  }, [clickedSubCat])
  return [clickedSubCat, setClickedSubCat];
}

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
  let [yearValue, setYearValue] = useState('2022');
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
  let handleCountryChange = e => setCountryValue(e.target.value);
  useEffect(() => {
    setCountryValue(countryValue);
  }, [countryValue]);

  return [countryValue, setCountryValue, handleCountryChange];
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
  let [spiByCountry, setSpiByCountry] = useState();
  useEffect(() => {
    getSpiDataByCountry(spiByYear, countryValue)
      .then(d => setSpiByCountry(d));
  }, [spiByYear, countryValue]);

  return [spiByCountry];
};

export function useDefinitions() {
  let [defContext, setDefContext] = useState({
    dimension: null,
    component: null,
    indicator_number: null,
  })
  useEffect(() => {
    setDefContext(defContext);
  }, [defContext, setDefContext])

  return [defContext, setDefContext];
};

export function scoreToColor(score) {
  let scoreColor = d3.scaleLinear()
    .domain([0, 20, 40, 60, 80, 100])
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
};

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

export function useMapSize(height, width) {
  let heightCalc = (window.matchMedia('(orientation: landscape)').matches && window.matchMedia('(min-width: 600px)').matches) ? height : height * .5;
  let widthCalc = (window.matchMedia('(orientation: landscape)').matches && window.matchMedia('(min-width: 600px)').matches) ? width * .6 : width;
  const [mapHeight, setMapHeight] = useState([heightCalc, widthCalc]);
  useEffect(() => {
    setMapHeight([heightCalc, widthCalc]);
  }, [heightCalc, widthCalc]);
  return mapHeight;
};

//sets topoJSON map data into state, and only changes when the yearValue triggers a change in spiData
export function useMapData(mapData, spiData, setLoadingCallback) {
  const [stateMapData, setStateMapData] = useState(null);
  const [stateSpiData, setStateSpiData] = useState(null);
  const loadMapData = useCallback(() => {
    mapData.then((m) => {
      setStateMapData(m);
    });
  }, [mapData]);

  useEffect(() => {
    setLoadingCallback(true);
    setStateSpiData(spiData);
    loadMapData();
    setLoadingCallback(false);
  }, [spiData, loadMapData, setLoadingCallback]);

  return [stateMapData, stateSpiData]
}

export function useToolTipData(spiByCountry) {
  const [tooltipData, setTooltipData] = useState(null);
  useEffect(() => {
    const parsedTooltipData = spiByCountry? parseTooltipData(spiByCountry[0]) : null;
    if(!parsedTooltipData)return;
    setTooltipData(parsedTooltipData);
  }, [spiByCountry])
  return [tooltipData, setTooltipData];
}


