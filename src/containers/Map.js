import React, { useState } from 'react';
import MapMaker from '../components/MapMaker';

function MapContainer({
  width, height,
  yearValue, setClickedSubCat, setClicked,
  spiData, mapData,
  countryValue, setCountryValue,
  tooltipContext, setToolTipContext, svgRef,
  zoomState, setZoomState }) {

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
          countryValue={countryValue}
          setCountryValue={setCountryValue}
          tooltipContext={tooltipContext}
          setToolTipContext={setToolTipContext}
          spiData={spiData}
          mapData={mapData}
          zoomState={zoomState}
          setZoomState={setZoomState}
          setClicked={setClicked}
          setClickedSubCat={setClickedSubCat}
        />
      </div>

    </>
  );
}

export default MapContainer;
