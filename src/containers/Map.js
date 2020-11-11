import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import MapChart from '../components/MapChart';
import { getContent } from '../selectors/contentSelector';
import { setContent } from '../actions/contentActions';
import ReactTooltip from "react-tooltip";


export default function MapContainer() {
  const dispatch = useDispatch();
  const content = useSelector(getContent);

// Check Swizec teller advice for Tooltips with DJ and React. 
// https://swizec.com/blog/tooltips-tooltips-are-not-so-easy


  useEffect(() => {
    dispatch(setContent(content));
  }, [content]);

return (
  <div id="map"> 
    <MapChart setTooltipContent={setContent} />
    <ReactTooltip>{content}</ReactTooltip>
  </div>

)};
