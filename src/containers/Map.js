import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import MapChart from '../components/MapChart';
import { getContent } from '../selectors/contentSelector';
import { setContent } from '../actions/contentActions';
import ReactTooltip from "react-tooltip";
import Header from '../components/Header';
import { connect } from 'react-redux';


function MapContainer() {
  const content = useSelector(getContent);
  const dispatch = useDispatch();

// // Check Swizec teller advice for Tooltips with DJ and React. 
// // https://swizec.com/blog/tooltips-tooltips-are-not-so-easy

  useEffect(() => {
    return ()=> dispatch(setContent(content)) 
  }, []);

  
  return (
    <div> 
    <Header />
    <MapChart setTooltipContent={setContent} id="MapChart" />
    <ReactTooltip>{content}</ReactTooltip>
  </div>

)};

const mapStateToProps = (state) => {
  return {
    content: state.content
  }
};
const mapDispatchToProps = (dispatch) => (
    (content)=> dispatch(setContent(content))
);
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MapContainer);
