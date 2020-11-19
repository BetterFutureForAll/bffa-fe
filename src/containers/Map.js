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
    console.log('Content Updated');
    dispatch(setContent()); 
  }, []);



  return (
    <div id="MapContainer" > 
    <Header />
    <MapChart setTooltipContent={()=> setContent()} id="MapChart" />
    <ReactTooltip>{content}</ReactTooltip>
  </div>

)};

// [content, setContent] = useState('');

const mapStateToProps = (state) => ({
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
