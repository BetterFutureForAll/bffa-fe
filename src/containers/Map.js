import React, { useState } from 'react';
import MapMaker from '../components/MapMaker';

function MapContainer({
  toggleModal, width, height,
  yearValue, setClickedSubCat, setClicked,
  center, setCenter, spiData, mapData,
  countryValue, setCountryValue,
  tooltipContext, setToolTipContext, svgRef,
  zoomState, setZoomState, toggle }) {

  let [loading, setLoading] = useState(true);

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
          zoomState={zoomState}
          setZoomState={setZoomState}
          toggle={toggle}
          setClicked={setClicked}
          setClickedSubCat={setClickedSubCat}
        />


      </div>

    </>
  );
}

export default MapContainer;
