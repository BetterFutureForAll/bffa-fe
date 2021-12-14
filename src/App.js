import React, { useEffect, useRef } from 'react';
// import './Reset.css';
import './App.css';
import MapContainer from './containers/Map';
import { useDataByCountry, useDataByYear, useModal, useToolTip, useYears, useHandleYearChange, useClickedSubCat, useCenter } from './hooks/hooks';
import ModalDefinitions from './containers/ModalDefinitions';
import Portal from './containers/Portal';
import { useWindowSize, useHandleCountryChange, useCountries } from './hooks/hooks';

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

  let handleCountryChange = e => setCountryValue(e.target.value);

  // May need Redux to control state.
  let [spiByYear] = useDataByYear(yearValue);
  let [spiByCountry, setSpiByCountry] = useDataByCountry(spiByYear, countryValue);

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

  useEffect(()=>{
    setCenter([width / 2, height / 2]);
  }, [height, width]);

  useEffect(() => {
    setToolTipContext({
      svgRef, 
      center, 
      countryValue,
      data: spiByCountry
    });
    console.log(spiByYear);
  }, [countryValue, yearValue, spiByCountry])


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
        />
      </div>
    </div>
  );
}

export default App;
