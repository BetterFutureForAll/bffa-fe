import React, { useEffect, useRef } from 'react';
// import './Reset.css';
import './App.css';
import * as d3 from 'd3'
import MapContainer from './containers/Map';
import { useDataByCountry, useDataByYear, useModal, 
         useToolTip, useYears, useHandleYearChange, 
         useCenter, useZoom, 
        } from './hooks/hooks';
import ModalDefinitions from './containers/ModalDefinitions';
import Portal from './containers/Portal';
import { useWindowSize, useHandleCountryChange, useCountries } from './hooks/hooks';

let localGeoData = process.env.PUBLIC_URL + '/cleanedMap.json';

function App() {
  let { showModal, toggleModal } = useModal();
  let target = "modal-ref";
  let modalRef = useRef(null);
  let [width, height] = useWindowSize();
  let [countryValue, setCountryValue] = useHandleCountryChange();
  let [countries] = useCountries();
  let [years] = useYears();
  let [yearValue, handleYearChange] = useHandleYearChange();
  let [tooltipContext, setToolTipContext] = useToolTip();
  let [zoomState, setZoomState] = useZoom();

  let mapData = d3.json(localGeoData).then(r => {
    return r;
  });
  let pathRef = useRef();


  let handleCountryChange = e => setCountryValue(e.target.value);

  // May need Redux to control state.
  let [spiByYear] = useDataByYear(yearValue);
  let [spiByCountry] = useDataByCountry(spiByYear, countryValue);

  // let [clickedSubCat, setClickedSubCat] = useClickedSubCat();
  let svgRef = useRef(null);
  let [center, setCenter] = useCenter();

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

  let children =
    <>
      <ModalDefinitions
        toggleModal={toggleModal}
        showModal={showModal}
        modalRef={modalRef}
      />
    </>;

  useEffect(() => {
    setToolTipContext({
      svgRef, 
      center, 
      countryValue,
      data: spiByCountry
    });
  }, [countryValue, yearValue, center, spiByCountry, setToolTipContext])


  return (
    <div className="App">
      <div id={target} >
        <Portal
          id={target}
          children={showModal ? children : null}
          width={width}
          height={height}
        />
        <MapContainer
          showModal={showModal}
          toggleModal={toggleModal}
          svgRef={svgRef}
          width={width}
          height={height}
          selectYears={selectYears}
          yearValue={yearValue}
          selectCountries={selectCountries}
          countryValue={countryValue}
          setCountryValue={setCountryValue}
          tooltipContext={tooltipContext}
          setToolTipContext={setToolTipContext}
          center={center}
          setCenter={setCenter}
          spiData={spiByYear}
          mapData={mapData}
          path={pathRef}
          zoomState={zoomState}
          setZoomState={setZoomState}
        />
      </div>
    </div>
  );
}

export default App;
