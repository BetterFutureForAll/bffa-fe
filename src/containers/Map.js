import React, { useState } from 'react';
import Header from '../components/Header';
import { useClicked, useMouse } from '../hooks/hooks';
import MapMaker from '../components/MapMaker';

function MapContainer({ 
  toggleModal, width, height, 
  selectYears, yearValue, 
  clickedSubCat, setClickedSubCat,
  center, setCenter, spiData, 
  countryValue, setCountryValue, selectCountries, 
  tooltipContext, setToolTipContext, svgRef }) {

    let [loading, setLoading] = useState(true);
  let [clicked, setClicked] = useClicked();
  let [setMouse] = useMouse();


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
          center={center}
          setCenter={setCenter}
          spiData={spiData}
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
