import React from 'react';
import { connect } from 'react-redux';
import MapChart from '../components/MapChart';
import ReactTooltip from "react-tooltip";
import Header from '../components/Header';

// import { getContent } from '../selectors/contentSelector';
// import * as spiData from '../assets/2011-2020-Social-Progress-Index.csv'
// import { spi2020, makeYearsArray } from '../services/SocialProgress';

import { useHandleYearChange, useYears, useContent } from '../hooks/hooks';

function MapContainer() {

  let [years] = useYears();
  let [content, setContent] = useContent();
  let [yearValue, handleYearChange] = useHandleYearChange();

  let yearsOptions = years.map((year, i) => {
    return <option key={i} value={year} onChange={handleYearChange}>{year}</option>
  });

  return (
    <div id="MapContainer" >
      <Header
        yearsOptions={yearsOptions}
        onChange={handleYearChange}
        value={yearValue}
      />
      <MapChart setTooltipContent={setContent} id="MapChart" />
      <ReactTooltip>{content}</ReactTooltip>
    </div>

  )
};

export default connect(
  null,
  null
)(MapContainer);
