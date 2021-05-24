import React, { useRef, useEffect } from 'react';
import ReactTooltip from 'react-tooltip';
import Header from '../components/Header';
import { 
  useHandleYearChange, 
  useYears, useCountries, 
  useHandleCountryChange, useClicked, useMouse
} from '../hooks/hooks';
import MapMaker from '../components/MapMaker';



function MapContainer() {
  const svgRef = useRef(null);

  let width = 1000;
  let height = 700;

  let [clicked, setClicked] = useClicked();
  let [setMouse] = useMouse();
  let [years] = useYears();
  let [yearValue, handleYearChange] = useHandleYearChange();

  let [countries] = useCountries();
  let [countryValue, handleCountryChange] = useHandleCountryChange();

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
        clicked={clicked} 
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
