import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import MapChart from '../components/MapChart';
import { getContent } from '../selectors/contentSelector';
import { setContent } from '../actions/contentActions';
import ReactTooltip from "react-tooltip";
import Header from '../components/Header';
import { connect } from 'react-redux';


function MapContainer(state) {
  const content = useSelector(getContent);
  const dispatch = useDispatch();

// // Check Swizec teller advice for Tooltips with DJ and React. 
// // https://swizec.com/blog/tooltips-tooltips-are-not-so-easy

  useEffect(() => {
    return ()=> { dispatch(setContent) }
  }, []);

  
  return (
    <div> 
    <Header />
    <MapChart setTooltipContent={state.setContent} id="MapChart" />
    <ReactTooltip>{content}</ReactTooltip>
  </div>

)};

// Already Mapped to props in App, change to PropTypes.
const mapStateToProps = (state) => {
  return {
    content: state.content
  }
};
const mapDispatchToProps = dispatch => {
  dispatch(setContent())
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MapContainer, MapChart);
