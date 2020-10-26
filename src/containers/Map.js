import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import MapChart from '../components/MapChart';
import { getScore } from '../selectors/scoreSelector';
import { createScore } from '../actions/scoreActions';
import { getContent } from '../selectors/contentSelector';
import ReactTooltip from "react-tooltip";


export default function MapContainer() {
  const dispatch = useDispatch();
  const setContent = useSelector(getScore);
  const content = useSelector(getContent);
  // const [content, setContent] = map;

  useEffect(()=>{
   if(!content) dispatch(createScore(setContent));
  }, [content]);

return (
  <div>
    <MapChart setTooltipContent={setContent} />
    <ReactTooltip>{content}</ReactTooltip>
  </div>

)};