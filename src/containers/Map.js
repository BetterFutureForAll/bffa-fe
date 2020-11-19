import React, { useEffect } from 'react';
import { useSelector, useDispatch, connect } from 'react-redux';
import MapChart from '../components/MapChart';
import { getContent } from '../selectors/contentSelector';
import { getYears } from '../selectors/scoreSelector';
import { setContent } from '../actions/contentActions';
import ReactTooltip from "react-tooltip";
import Header from '../components/Header';


function MapContainer() {
  let content = useSelector(getContent);
  let years = useSelector(getYears);
  let dispatch = useDispatch();


  useEffect(() => {
    console.log('Content Updated');
    dispatch(setContent()); 
    dispatch(getYears);
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
  years: state.score.years,
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
