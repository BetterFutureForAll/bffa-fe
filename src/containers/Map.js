import React, { useState } from 'react';
import Header from '../components/Header';
// import { useClicked, useMouse } from '../hooks/hooks';
import MapMaker from '../components/MapMaker';

function MapContainer({ 
  toggleModal, width, height, 
  selectYears, yearValue, 
  center, setCenter, spiData, mapData, path, 
  countryValue, setCountryValue, selectCountries, 
  tooltipContext, setToolTipContext, svgRef,
  zoomState, setZoomState }) {

  let [loading, setLoading] = useState(true);
  // let [clicked, setClicked] = useClicked();
  // let [setMouse] = useMouse();


  return (
    <>
      <div id="MapContainer" >
        <MapMaker
          svgRef={svgRef}
          yearValue={yearValue}
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
          mapData={mapData}
          path={path}
          zoomState={zoomState}
          setZoomState={setZoomState}
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
