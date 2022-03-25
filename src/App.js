import React, { useEffect, useRef } from 'react';
// import './Reset.css';
import './App.css';
import * as d3 from 'd3'
import MapContainer from './containers/Map';
import {
  useDataByCountry, useDataByYear, useModal,
  useToolTip, useYears, useHandleYearChange,
  useCenter, useZoom, useToggle, useTarget,
  useClickedSubCat, useClicked, useDefinitions
} from './hooks/hooks';
import ModalDefinitions from './containers/ModalDefinitions';
import Header from './components/Header';
import { useWindowSize, useHandleCountryChange, useCountries } from './hooks/hooks';

let localGeoData = process.env.PUBLIC_URL + '/cleanedMap.json';

function App() {
  let { showModal, toggleModal } = useModal();
  // let target = "modal-ref";
  let modalRef = useRef(null);
  // Total screen size available
  let [width, height] = useWindowSize();
  // Map Size
  let mapHeight = height * .4;
  // Definitions Size
  let defHeight = height * .6;

  let [countryValue, setCountryValue] = useHandleCountryChange();
  let [countries] = useCountries();
  let [years] = useYears();
  let [yearValue, handleYearChange] = useHandleYearChange();

  let [tooltipContext, setToolTipContext] = useToolTip();
  let [zoomState, setZoomState] = useZoom();
  let [isToggled, toggle] = useToggle(false);
  let [clicked, setClicked] = useClicked();
  let [clickedSubCat, setClickedSubCat] = useClickedSubCat();
  let [defContext, setDefContext] = useDefinitions();

  let mapData = d3.json(localGeoData);
  
  let handleCountryChange = e => setCountryValue(e.target.value);

  let [spiByYear] = useDataByYear(yearValue);
  let [spiByCountry] = useDataByCountry(spiByYear, countryValue);

  let svgRef = useRef(null);

  let [center, setCenter] = useCenter(width, mapHeight);

  let selectYears = (
    <>
      <select onChange={handleYearChange} value={yearValue} >
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
    <select onChange={handleCountryChange} value={countryValue}>
      {countries.map(item => (
        <option key={item} value={item} onSelect={handleCountryChange}>
          {item}
        </option>
      ))}
    </select>
  );

  useEffect(() => {
    let id = clicked ? clicked.replace(/ /g, "_") : null;
    setDefContext({
      dimension: id,
      component: clickedSubCat
    });
  }, [clicked, clickedSubCat])

  useEffect(() => {
    setToolTipContext({
      svgRef,
      center,
      countryValue,
      show: isToggled,
      data: spiByCountry
    });
  }, [countryValue, yearValue, center, spiByCountry, setToolTipContext, isToggled])


  return (
    <div className="App">
      <MapContainer
        showModal={showModal}
        toggleModal={toggleModal}
        svgRef={svgRef}
        width={width}
        height={mapHeight}
        selectYears={selectYears}
        yearValue={yearValue}
        countryValue={countryValue}
        setCountryValue={setCountryValue}
        tooltipContext={tooltipContext}
        setToolTipContext={setToolTipContext}
        center={center}
        setCenter={setCenter}
        spiData={spiByYear}
        mapData={mapData}
        zoomState={zoomState}
        setZoomState={setZoomState}
        toggle={toggle}
        setClicked={setClicked}
        setClickedSubCat={setClickedSubCat}
      />
      <ModalDefinitions
        toggleModal={toggleModal}
        showModal={showModal}
        modalRef={modalRef}
        spiData={spiByCountry}
        defContext={defContext}
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
  );
}

export default App;
