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

  return (
    <div id="MapContainer" > 
    <Header years={years} />
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
