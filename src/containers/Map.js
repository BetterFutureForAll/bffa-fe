import React, { useEffect } from 'react';
import { useSelector, useDispatch, connect } from 'react-redux';
import MapChart from '../components/MapChart';
import { getContent } from '../selectors/contentSelector';
import { setContent } from '../actions/contentActions';
import ReactTooltip from "react-tooltip";
import Header from '../components/Header';


function MapContainer() {
  let content = useSelector(state => state.content);
  let dispatch = useDispatch();

  useEffect(() => {
    console.log(content);
    dispatch(setContent(content)); 
  }, [content]);

  return (
    <div> 
    <Header />
    <MapChart setTooltipContent={()=> setContent(content)} id="MapChart" />
    <ReactTooltip>{content}</ReactTooltip>
  </div>

)};

// MapContainer.propTypes = {
//   content: PropTypes.string.isRequired
// };

const mapStateToProps = (state) => ({
  content: getContent(state)
});
const mapDispatchToProps = (dispatch) => ({
  setToolTipContent(content) {
    dispatch({ type: setContent(content)})
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MapContainer);
