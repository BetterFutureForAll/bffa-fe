import React, { useRef, useState, useEffect } from 'react';
import Header from '../components/Header';
import {
  useHandleYearChange,
  useYears, useCountries,
  useHandleCountryChange, useClicked, useMouse,
  useClickedSubCat
} from '../hooks/hooks';
import MapMaker from '../components/MapMaker';

function MapContainer({ toggleModal, width, height }) {

  const svgRef = useRef(null);

  let [loading, setLoading] = useState(true);
  let [clicked, setClicked] = useClicked();
  let [setMouse] = useMouse();
  let [years] = useYears();
  let [yearValue, handleYearChange] = useHandleYearChange();
  let [clickedSubCat, setClickedSubCat] = useClickedSubCat();

  let [countries] = useCountries();
  let [countryValue, handleCountryChange, setCountryValue] = useHandleCountryChange();

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
        <option key={item} value={item} onSelect={handleCountryChange}>
          {item}
        </option>
      ))}
    </select>
  );

  useEffect(() => {
      setCountryValue(countryValue)
  }, [width, height, countryValue, setCountryValue]);


  return (
    <>
      <div id="MapContainer" >
        <MapMaker
          svgRef={svgRef}
          setClicked={setClicked}
          clicked={clicked}
          setClickedSubCat={setClickedSubCat}
          clickedSubCat={clickedSubCat}
          yearValue={yearValue}
          setMouse={setMouse}
          height={height}
          width={width}
          loading={loading}
          setLoading={setLoading}
          toggleModal={toggleModal}
          countries={countries}
          countryValue={countryValue}
          setCountryValue={setCountryValue}
          handleCountryChange={handleCountryChange}
        />
        <div className="ControlBar">
          <Header
            height={height}
            width={width}
            selectYears={selectYears}
            yearValue={yearValue}
            selectCountries={selectCountries}
            countryValue={countryValue}
            toggleModal={toggleModal}
          />
        </div>

      </div>

    </>
  );
}

export default MapContainer;
