import React, { useEffect, useLayoutEffect, useRef } from 'react';
import './App.css';
import MapContainer from './containers/Map';
import {
  useDataByCountry, useDataByYear, useYears,
  useToolTip, useHandleYearChange, useZoom,
  useClickedSubCat, useClicked, useDefinitions, useMapSize
} from './hooks/hooks';
import ModalDefinitions from './containers/ModalDefinitions';
import { useWindowSize, useHandleCountryChange, useCountries } from './hooks/hooks';
import Legend from './components/Legend';
import ControlBar from './components/ControlBar';

function App() {
  let modalRef = useRef(null);
  // Total screen size available
  let [width, height] = useWindowSize();
  // Map Size
  let [mapHeight, mapWidth] = useMapSize(height, width);
  let [countryValue, setCountryValue] = useHandleCountryChange();
  let [countries] = useCountries();
  let [years] = useYears();
  let [yearValue, handleYearChange] = useHandleYearChange();

  //  ToolTip State
  let [tooltipContext, setToolTipContext] = useToolTip();
  let [zoomState, setZoomState] = useZoom();
  let [clicked, setClicked] = useClicked();
  let [clickedSubCat, setClickedSubCat] = useClickedSubCat();
  let [defContext, setDefContext] = useDefinitions();


  let handleCountryChange = e => setCountryValue(e.target.value);

  let [spiByYear] = useDataByYear(yearValue);
  let [spiByCountry] = useDataByCountry(spiByYear, countryValue);

  let svgRef = useRef(null);

  let selectYears = (
    <>
      <select className='select-years' onChange={handleYearChange} value={yearValue} >
        {years.map((item, i) => (
          <option
            key={i}
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
    <select className='select-countries' onChange={handleCountryChange} value={countryValue}>
      {countries.map((item, i) => (
        <option key={i} value={item} onSelect={handleCountryChange}>
          {item}
        </option>
      ))}
    </select>
  );

  useLayoutEffect(() => {
    let id = clicked ? clicked.replace(/ /g, "_") : null;
    let subId = clickedSubCat ? clickedSubCat.replace(/ /g, "_") : null;
    setDefContext({
      dimension: id,
      component: subId,
      countryValue: countryValue
    });
  }, [clicked, clickedSubCat, setDefContext, countryValue])

  useEffect(() => {
    setToolTipContext({
      svgRef,
      countryValue,
      data: spiByCountry,
    });
  }, [countryValue, yearValue, spiByCountry, setToolTipContext])

  return (
    <div className="App">
      <MapContainer
        svgRef={svgRef}
        width={mapWidth}
        height={mapHeight}
        selectYears={selectYears}
        yearValue={yearValue}
        countryValue={countryValue}
        setCountryValue={setCountryValue}
        tooltipContext={tooltipContext}
        setToolTipContext={setToolTipContext}
        spiData={spiByYear}
        zoomState={zoomState}
        setZoomState={setZoomState}
        setClicked={setClicked}
        setClickedSubCat={setClickedSubCat}
      />
      <Legend
        height={mapHeight}
        width={mapWidth}
      />
      <div className="ControlBar">
        <ControlBar
          selectYears={selectYears}
          yearValue={yearValue}
          selectCountries={selectCountries}
          countryValue={countryValue}
          spiData={spiByCountry}
        />
      </div>
      <ModalDefinitions
        modalRef={modalRef}
        spiData={spiByCountry}
        defContext={defContext}
      />
    </div>
  );
}

export default App;
