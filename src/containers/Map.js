import React, { useEffect } from 'react';
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


  useEffect(() => {
    console.log('Content Updated');
    spi2020.then(d=> console.log(d));
    dispatch(createYears(spi2020));
    dispatch(setContent()); 
  }, []);



  return (
    <div id="MapContainer" > 
    <Header years={years} />
    <MapChart setTooltipContent={()=> setContent()} id="MapChart" />
    <ReactTooltip>{content}</ReactTooltip>
  </div>

)};

// [content, setContent] = useState('');

const mapStateToProps = (state) => ({
  years: state.scores.years,
  content: getContent(state)
});
const mapDispatchToProps = (dispatch) => ({
  setToolTipContent(setContent) {
    dispatch(setContent)
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MapContainer);
