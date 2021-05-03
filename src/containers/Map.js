import React, { useRef, useEffect } from 'react';
import MapChart from '../components/MapChart';
import ReactTooltip from 'react-tooltip';
import Header from '../components/Header';
import { 
  useHandleYearChange, 
  useYears, useContent, 
  useDataByYear, useCountries, 
  useHandleCountryChange, useFlowers, 
  useSingleFlower, useDataByCountry, useD3, useClicked, useMouse
} from '../hooks/hooks';
import DrawFlowers from '../components/DrawFlowers';
import MapMaker from '../components/MapMaker';



function MapContainer() {
  const svgRef = useRef(null);
  let petalSize = 50;

  let margin = { top: 50, left: 50, right: 50, bottom: 50 };

  let width = 1000;
  let height = 500;


  let [clicked, setClicked] = useClicked();
  let [mouse, setMouse] = useMouse();
  let [years] = useYears();
  let [yearValue, handleYearChange] = useHandleYearChange();
  let [spiByYear]  = useDataByYear(yearValue);

  let [countries] = useCountries();
  let [countryValue, handleCountryChange] = useHandleCountryChange();
  let [spiByCountry] = useDataByCountry(spiByYear, countryValue);

  useEffect(()=>{
    ReactTooltip.rebuild();
  }, [countryValue, yearValue]);

  let selectYears = (
    <>
      <select onChange={handleYearChange} defaultValue={yearValue} >
        {years.map(item => (
          <option
            key={item}
            value={item}
            onSelect={handleYearChange}
          >
            {item}
          </option>
        ))}
      </select>
    </>
  );

  let selectCountries = (
    <select onChange={handleCountryChange} defaultValue={countryValue}>
      {countries.map(item => (
        <option key={item} value={item}>
          {item}
        </option>
      ))}
    </select>
    );
        
  return (
    <>
    <div id="MapContainer" >
      <MapMaker 
        svgRef={svgRef}
        setClicked={setClicked} 
        yearValue={yearValue} 
        setMouse={setMouse} 
        height={height}
        width={width}  
        />
      <div className="ControlBar">
        <Header 
          selectYears={selectYears} 
          yearValue={yearValue} 
          selectCountries={selectCountries}
          countryValue={countryValue}
        />
      </div>

  </div>

</>
  );
}

export default MapContainer;
