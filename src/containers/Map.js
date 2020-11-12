import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import MapChart from '../components/MapChart';
import { getContent } from '../selectors/contentSelector';
import { setContent } from '../actions/contentActions';
import ReactTooltip from "react-tooltip";
import Header from '../components/Header';

// Check Swizec teller advice for Tooltips with DJ and React. 
// https://swizec.com/blog/tooltips-tooltips-are-not-so-easy

export default function MapContainer() {
  const content = useSelector(getContent);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setContent())
  }, []);

return (
  <div> 
    <Header />
    <MapChart setTooltipContent={setContent} id="MapChart" />
    <ReactTooltip>{content}</ReactTooltip>
  </div>

)};
