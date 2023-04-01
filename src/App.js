import React, { useEffect, useLayoutEffect, useRef } from 'react';
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
  useToolTip, 
  useHandleYearChange, 
  useZoom, 
  useLoading,
  useClickedSubCat, 
  useClicked, 
  useDefinitions, 
  useMapSize, 
  useMapData,
} from './hooks/hooks';
import { promisedMap } from './services/SocialProgress';
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
  let [countryValue, setCountryValue] = useHandleCountryChange();
  let [countries] = useCountries();
  let [years] = useYears();
  let [yearValue, handleYearChange] = useHandleYearChange();

  //  ToolTip State
  // let [tooltipContext, setToolTipContext] = useToolTip();
  let [zoomState, setZoomState] = useZoom();
  let [clicked, setClicked] = useClicked();
  let [clickedSubCat, setClickedSubCat] = useClickedSubCat();
  let [defContext, setDefContext] = useDefinitions();

  let handleCountryChange = e => setCountryValue(e.target.value);

  let [spiByYear] = useDataByYear(yearValue);
  let [spiByCountry] = useDataByCountry(spiByYear, countryValue);
  let [loading, setLoadingCallback] = useLoading();


  // if(loading) { console.log("loading") } else { console.log(spiByCountry, tooltipData) }

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
  
  let [tooltipData] = useToolTipData(spiByCountry);

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
        setCountryValue={setCountryValue}
        zoomState={zoomState}
        setZoomState={setZoomState}
        setClicked={setClicked}
        setClickedSubCat={setClickedSubCat}
      >
      </MapMaker>
      <ToolTip
        svgRef={svgRef}
        tooltipData={tooltipData}
        loading={loading}
        center={[mapWidth/2, mapHeight/2]}
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