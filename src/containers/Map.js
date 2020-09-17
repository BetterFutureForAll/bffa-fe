import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import MapChart from '../components/MapChart';
import { getScore } from '../selectors/scoreSelector';
import { createScore } from '../actions/scoreActions';
import { getMap } from '../selectors/mapSelector';
import ReactTooltip from "react-tooltip";


export default function MapContainer() {
  const dispatch = useDispatch();
  const map = useSelector(getMap);
  const score = useSelector(getScore);
  // const [content, setContent] = map;

  useEffect(()=>{
    // dispatch(createScore);
  }, []);

return (
  <div>
    <MapChart setTooltipContent={map} score={score}/>
    <ReactTooltip>{map}</ReactTooltip>
  </div>

)};