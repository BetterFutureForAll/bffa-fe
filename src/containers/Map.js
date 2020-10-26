import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import MapChart from '../components/MapChart';
import { getScore } from '../selectors/scoreSelector';
import { createScore } from '../actions/scoreActions';
import { getMap } from '../selectors/mapSelector';
import ReactTooltip from "react-tooltip";


export default function MapContainer() {
  const dispatch = useDispatch();
  const setContent = useSelector(getMap);
  const content = useSelector(getScore);
  // const [content, setContent] = map;

  useEffect(()=>{
    dispatch(createScore(content));
  }, []);

return (
  <div>
    <MapChart setTooltipContent={setContent} />
    <ReactTooltip>{content}</ReactTooltip>
  </div>

)};