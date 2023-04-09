import React, { useLayoutEffect, useRef } from 'react';
import './App.css';
import MapMaker from './components/MapMaker';
import ToolTip from './components/ToolTip';
import {
  useDataByCountry, 
  useDataByYear, 
  useYears, 
  useWindowSize, 
  useHandleCountryChange, 
  useCountries,
  useToolTipData,
  useHandleYearChange, 
  useLoading,
  useClickedSubCat, 
  useClicked, 
  useDefinitions, 
  useMapSize, 
  useMapData,
} from './hooks/hooks';
import { promisedMap, useParsedCitations } from './services/SocialProgress';
import ModalDefinitions from './containers/ModalDefinitions';
import Legend from './components/Legend';
import ControlBar from './components/ControlBar';

function App() {

  let svgRef = useRef(null);
  let modalRef = useRef(null);

  // Total screen size available
  let [width, height] = useWindowSize();

  // Map Size
  let [mapHeight, mapWidth] = useMapSize(height, width);
  let [countryValue, setCountryValue, handleCountryChange] = useHandleCountryChange();
  let [countries] = useCountries();
  let [years] = useYears();
  let [yearValue, handleYearChange] = useHandleYearChange();


  //  ToolTip State
  let [clicked, setClickedCallback] = useClicked();
  let [clickedSubCat, setClickedSubCatCallback] = useClickedSubCat();
  let [defContext, setDefContext] = useDefinitions();

  let [spiByYear] = useDataByYear(yearValue);
  let [spiByCountry] = useDataByCountry(spiByYear, countryValue);
  let [loading, setLoadingCallback] = useLoading();
  let [tooltipData] = useToolTipData(spiByCountry);

  let parsedDefinitions = useParsedCitations();

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
      countryValue: countryValue,
      //set to state
      indicator_number: null,
    });
  }, [clicked, clickedSubCat, setDefContext, countryValue])

  let [mapData, spiData] = useMapData(promisedMap, spiByYear, setLoadingCallback);
  let mapProps = {
    loading,
    mapData,
    svgRef,
    spiData,
    size: [mapWidth, mapHeight],
    yearValue,
  }

  return (
    <div className="App">
      <div id="MapContainer" >
        <svg ref={svgRef} height={mapHeight} width={mapWidth} id="map">
        </svg>
      </div>
      <MapMaker
        mapProps={mapProps}
        countryValue={countryValue}
        yearValue={yearValue}
        setCountryValue={setCountryValue}
      >
      </MapMaker>
      <ToolTip
        svgRef={svgRef}
        tooltipData={tooltipData}
        loading={loading}
        mapHeight={mapHeight}
        mapWidth={mapWidth}
        setClickedCallback={setClickedCallback}
        setClickedSubCatCallback={setClickedSubCatCallback}
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
        spiByCountry={spiByCountry}
        defContext={defContext}
        parsedDefinitions={parsedDefinitions}
      />
    </div>
  );
}

export default App;

  //State for the DefinitionsModal
  // const setDefContext = useCallback(() => {
  //   const id = clicked ? clicked.replace(/ /g, "_") : null;
  //   const subId = clickedSubCat ? clickedSubCat.replace(/ /g, "_") : null;
  //   setDefContext({
  //     dimension: id,
  //     component: subId,
  //     countryValue,
  //     indicator_number: null,
  //   });
  // }, [clicked, clickedSubCat, setDefContext, countryValue]);

  // useLayoutEffect(() => {
  //   setDefContext();
  // }, [setDefContext]);