import React, { useEffect } from 'react';
import { useSelector, useDispatch, connect } from 'react-redux';
import MapChart from '../components/MapChart';
import { getContent } from '../selectors/contentSelector';
import { setContent } from '../actions/contentActions';
import ReactTooltip from "react-tooltip";
import Header from '../components/Header';


function MapContainer() {
  let content = useSelector(getContent);
  let dispatch = useDispatch();

  useEffect(() => {
    console.log(content);
    dispatch(setContent(content)); 
  }, [content, dispatch]);



  return (
    <div id="MapContainer" > 
    <Header />
    <MapChart setTooltipContent={()=> setContent(content)} id="MapChart" />
    <ReactTooltip>{content}</ReactTooltip>
  </div>

)};

const mapStateToProps = (state) => ({
  content: getContent(state)
});
const mapDispatchToProps = (content) => ({
  setToolTipContent: setContent(content)
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MapContainer);
