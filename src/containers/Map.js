import React, { useEffect, useCallback, useState } from 'react';
import { useSelector, useDispatch, connect } from 'react-redux';
import MapChart from '../components/MapChart';
import { getContent } from '../selectors/contentSelector';
import { getYears } from '../selectors/scoreSelector';
// import { setContent } from '../actions/contentActions';
// import { createYears } from '../actions/scoreActions';
import ReactTooltip from "react-tooltip";
import Header from '../components/Header';

// import useContent from '../hooks/hooks';

import * as spiData from '../assets/2011-2020-Social-Progress-Index.csv'
import { spi2020, makeYearsArray } from '../services/SocialProgress';

function MapContainer() {
  
  let [years, setYears ] = useState([]);

    useEffect(()=> {
      makeYearsArray()
        .then(parsedYears => setYears(parsedYears))
    }, []);

  let [content, setContent] = useState('');
  let [yearValue, setYearValue] = useState();

  // useEffect(()=> {
  //   handleYearChange(yearValue)
  // }, [yearValue])

  function handleYearChange() {
    setYearValue()
    console.log('chosen year = ' + yearValue)
    document.title = `SPI for ${yearValue}`;
  };

  let yearsOptions = years.map((year, i )=> {
    return <option key={i} value={year}>{year}</option>
  });

  return (
    <div id="MapContainer" > 
    <Header 
      years={yearsOptions}
      handleYearChange={handleYearChange} 
      selectedYear={yearValue}
      />
    <MapChart setTooltipContent={setContent} id="MapChart" />
    <ReactTooltip>{content}</ReactTooltip>
  </div>

)};


const mapStateToProps = (state) => ({
  years: state.scores.years,
  content: getContent(state)
});

export default connect(
  mapStateToProps,
  null
)(MapContainer);
