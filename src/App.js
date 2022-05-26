import React, { useEffect, useRef, useState } from 'react';
// import './Reset.css';
import './App.css';
import * as d3 from 'd3'
import MapContainer from './containers/Map';
import {
  useDataByCountry, useDataByYear,
  useToolTip, useYears, useHandleYearChange,
  useZoom, useClickedSubCat, useClicked, useDefinitions, useDefinitionsData,
  useDimensions,
  useComponents
} from './hooks/hooks';
import ModalDefinitions from './containers/ModalDefinitions';
import Dimensions from './containers/Dimensions';
import Header from './components/Header';
import { useWindowSize, useHandleCountryChange, useCountries } from './hooks/hooks';

let loadingSpinner = require('./assets/loading.gif');
let localGeoData = process.env.PUBLIC_URL + '/cleanedMap.json';

function App() {

  let modalRef = useRef(null);
  let [loading, setLoading] = useState(false);

  // Total screen size available
  let [width, height] = useWindowSize();
  // Map Size
  let mapHeight = height * .5;

  let [countryValue, setCountryValue] = useHandleCountryChange();
  let [countries] = useCountries();
  let [years] = useYears();
  let [dimensions] = useDimensions();
  let [definitionsData] = useDefinitionsData();

  let [yearValue, handleYearChange] = useHandleYearChange();

  let [tooltipContext, setToolTipContext] = useToolTip();
  let [zoomState, setZoomState] = useZoom();
  let [clicked, setClicked] = useClicked();
  let [clickedSubCat, setClickedSubCat] = useClickedSubCat();
  let [defContext, setDefContext] = useDefinitions();

  let mapData = d3.json(localGeoData);

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

  // const cacheImages = async (srcArray) => {
  //   const promises = await srcArray.map((src)=>{
  //     return new Promise(function (resolve, reject) {
  //       const img = new Image();
  //       img.src = src;
  //       img.onload = resolve();
  //       img.onerror = reject();
  //     });
  //   });
  //   await Promise.all(promises);
  //   setLoading(false);
  // }
  
  // const imgs = [
  //   logo, basic_needs, basic_nutrition, basic_water, basic_shelter, basic_safety,
  //   foundations, foundations_knowledge, foundations_communication, foundations_health, foundations_environmental,
  //   opportunity, opportunity_rights, opportunity_freedom, opportunity_inclusiveness, opportunity_education
  // ];

  // useEffect(()=>{
  //   cacheImages(imgs);
  // },[imgs])


  useEffect(() => {
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
      data: spiByCountry
    });
  }, [countryValue, yearValue, spiByCountry, setToolTipContext])


  return (
    <div className="App">
      {loading ?
        <img src={loadingSpinner} alt={'loading spinner'} id="loading-spinner" />
        :
        <>
          <MapContainer
            svgRef={svgRef}
            width={width}
            height={mapHeight}
            selectYears={selectYears}
            yearValue={yearValue}
            countryValue={countryValue}
            setCountryValue={setCountryValue}
            tooltipContext={tooltipContext}
            setToolTipContext={setToolTipContext}
            loading={loading}
            setLoading={setLoading}
            spiData={spiByYear}
            mapData={mapData}
            zoomState={zoomState}
            setZoomState={setZoomState}
            setClicked={setClicked}
            setClickedSubCat={setClickedSubCat}
          />
          <div className="ControlBar">
            <Header
              height={height}
              width={width}
              selectYears={selectYears}
              yearValue={yearValue}
              selectCountries={selectCountries}
              countryValue={countryValue}
              spiData={spiByCountry}

            />
          </div>
          {/* <ModalDefinitions
            modalRef={modalRef}
            spiData={spiByCountry}
            defContext={defContext}
            imgs={imgs}
          /> */}
          <Dimensions
            modalRef={modalRef}
            spiData={spiByCountry}
            defContext={defContext}
            dimensions={dimensions}
            definitionsData={definitionsData}
            setLoading={setLoading}
          />
        </>
      }
    </div>
  );
}

export default App;
