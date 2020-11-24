import React, { useEffect, useCallback } from 'react';
import { useSelector, useDispatch, connect } from 'react-redux';
import MapChart from '../components/MapChart';
import { getContent } from '../selectors/contentSelector';
import { getYears } from '../selectors/scoreSelector';
import { setContent } from '../actions/contentActions';
import { createYears } from '../actions/scoreActions';
import ReactTooltip from "react-tooltip";
import Header from '../components/Header';

import * as spiData from '../assets/2011-2020-Social-Progress-Index.csv'
import { spi2020 } from '../services/SocialProgress';

function MapContainer() {
  let content = useSelector(getContent);
  let years = useSelector(getYears);
  let dispatch = useDispatch();

  let contentCallback = useCallback(
    () => dispatch(setContent(content)), [content]
  );

  // async function fetchData() {
  //   // You can await here
  //   const response = await spi2020;
  //   console.log(response);
  //   dispatch(createYears(response));
  // };

  // [content, setContent] = useState('');

  return (
    <div id="MapContainer" > 
    <Header years={years} />
    <MapChart setTooltipContent={contentCallback} id="MapChart" />
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
