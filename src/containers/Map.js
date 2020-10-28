import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import MapChart from '../components/MapChart';
import { getScore } from '../selectors/scoreSelector';
import { createScore } from '../actions/scoreActions';
import { getContent } from '../selectors/contentSelector';
import ReactTooltip from "react-tooltip";


export default function MapContainer() {
  const dispatch = useDispatch();
  const setContent = useSelector(getContent);
  const content = useSelector(getContent);
  const score = useSelector(getScore);

  //Check Swizec teller advice for Tooltips with DJ and React. 


  useEffect(()=>{
   if(!content) dispatch(createScore(setContent));
   dispatch(getScore(score))
  }, []);

return (
  <div>
    <MapChart setTooltipContent={setContent} />
    <ReactTooltip>{content}</ReactTooltip>
  </div>

)};