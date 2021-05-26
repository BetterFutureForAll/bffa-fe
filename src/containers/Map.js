import React, { useRef, useState, useEffect } from 'react';
import Header from '../components/Header';
import { 
  useHandleYearChange, 
  useYears, useCountries, 
  useHandleCountryChange, useClicked, useMouse,
  useWindowSize
} from '../hooks/hooks';
import MapMaker from '../components/MapMaker';



function MapContainer() {

  const svgRef = useRef(null);

  let [loading, setLoading] = useState(true);

  // Query user and set based off browser.
  
  let width = useWindowSize();
  let height = width * .7;

  let [clicked, setClicked] = useClicked();
  let [setMouse] = useMouse();
  let [years] = useYears();
  let [yearValue, handleYearChange] = useHandleYearChange();

  let [countries] = useCountries();
  let [countryValue, handleCountryChange] = useHandleCountryChange();

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
  useEffect(()=>{
    // return adjusted window size
    // add window reSize listener
  },[]);


        
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
        loading={loading}
        setLoading={setLoading}
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
