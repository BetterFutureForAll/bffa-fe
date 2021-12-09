import React, { useRef, useState, useEffect } from 'react';
import Header from '../components/Header';
import {
  useHandleYearChange,
  useYears, useCountries,
  useClicked, useMouse,
  useClickedSubCat,
  useToolTip,
  useDataByCountry,
  useDataByYear
} from '../hooks/hooks';
import MapMaker from '../components/MapMaker';
import ToolTip from '../components/ToolTip';

function MapContainer({ toggleModal, width, height, countryValue, setCountryValue, selectCountries }) {

  const svgRef = useRef(null);

  let [loading, setLoading] = useState(true);
  let [clicked, setClicked] = useClicked();
  let [setMouse] = useMouse();
  let [years] = useYears();
  let [yearValue, handleYearChange] = useHandleYearChange();
  let [clickedSubCat, setClickedSubCat] = useClickedSubCat();
  let [tooltipContext, setToolTipContext] = useToolTip();

  // May need Redux to control state.
  let [spiByYear, setSpiByYear] = useDataByYear(yearValue);
  let [spiByCountry, setSpiByCountry] = useDataByCountry(spiByYear, countryValue);

  let handleSpiChange = e => setSpiByYear(e);
  let handleSpiCountryChange = e => setSpiByCountry(e);


  useEffect(()=>{
    handleSpiChange(yearValue)
    handleSpiCountryChange(countryValue)
    console.log('year:',spiByYear);
    console.log('country',spiByCountry);
  },[countryValue, yearValue])

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

  // useEffect(() => {

          
  //     // setCountryValue(countryValue)
  // }, [width, height, countryValue, setCountryValue]);


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
          countryValue={countryValue}
          setCountryValue={setCountryValue}
          tooltipContext={tooltipContext}
          setToolTipContext={setToolTipContext}
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
