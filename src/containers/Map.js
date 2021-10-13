import React, { useRef, useState, useEffect } from 'react';
import Header from '../components/Header';
import {
  useHandleYearChange,
  useYears, useCountries,
  useHandleCountryChange, useClicked, useMouse,
  useWindowSize, useClickedSubCat
} from '../hooks/hooks';
import MapMaker from '../components/MapMaker';
import Modal from '../components/Modal';

function MapContainer({ showModal, toggleModal }) {

  const svgRef = useRef(null);

  let [loading, setLoading] = useState(true);

  // Query user and set based off browser.

  let [width, height] = useWindowSize();

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
    // console.log();
      setCountryValue(countryValue)
    // return adjusted window size
    // add window reSize listener
  }, [width, height, countryValue, setCountryValue]);



  return (
    <>
      <div id="MapContainer" >
        <Modal
          showModal={showModal}
          toggleModal={toggleModal}
          countryValue={countryValue}
          clicked={clicked}
          clickedSubCat={clickedSubCat}
        />
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
