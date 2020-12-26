import React, { useEffect, useState } from 'react';
import MapChart from '../components/MapChart';
import ReactTooltip from 'react-tooltip';
import Header from '../components/Header';

import { 
  useHandleYearChange, 
  useYears, useContent, 
  useDataByYear,
  loopAnimator
  // handleAnimateClick
} from '../hooks/hooks';

function MapContainer() {

  let [years] = useYears();
  let [content, setContent] = useContent();
  let [yearValue, handleYearChange] = useHandleYearChange();
  let [spiByYear]  = useDataByYear(yearValue);
  let [animated, setAnimated] = useState(false);

  let handleSubmit = (e) => {
    e.preventDefault();
  };
  let handleAnimateClick = (e) => {
    e.preventDefault();
    setAnimated(!animated);
    console.log(animated);
    console.log(years);
    console.log(animatedYears());
  };

  /* //ternary here?   animated ? animatedYears : userYears */

  let animatedYears = () => {
    loopAnimator(years);
  };
  

  let selectYears = (
    <>
      <select onChange={handleYearChange} defaultValue={yearValue} onSubmit={handleSubmit} >
        {years.map(item => (
          <option
            key={item}
            value={item}
            onSelect={handleYearChange}
          >
            {item}
          </option>
        ))}
      </select>
      <button onClick={handleAnimateClick} value={yearValue}>Animate Years</button>
    </>
  );
        
  // animated ? animatedYears : selectYears

  return (
    <div id="MapContainer" >
      <div className="App-header">
        <Header 
          selectYears={selectYears} 
          yearValue={yearValue} 
          onSubmit={handleSubmit} 
        />
      </div>
      <MapChart 
        setTooltipContent={setContent} 
        data={spiByYear} 
        year={yearValue}
        id="MapChart" />
      <ReactTooltip html={true}>{content}</ReactTooltip>
    </div>

  );
}

export default MapContainer;
