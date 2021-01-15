import React, { useState } from 'react';
import MapChart from '../components/MapChart';
import ReactTooltip from 'react-tooltip';
import Header from '../components/Header';
import { 
  useHandleYearChange, 
  useYears, useContent, 
  useDataByYear,
  useLoopAnimator
  // handleAnimateClick
} from '../hooks/hooks';

function MapContainer() {

  let [years] = useYears();
  let [content, setContent] = useContent();
  let [yearValue, handleYearChange] = useHandleYearChange();
  let [spiByYear]  = useDataByYear(yearValue);
  let [animated, setAnimated] = useState(false);
  let [animatedYears, handleAnimationChange] = useLoopAnimator(years); 

  let handleSubmit = (e) => {
    e.preventDefault();
  };

  let handleAnimateClick = () => {
    // e.preventDefault();
    setAnimated(!animated);
    // handleAnimationChange();
    console.log('Button Clicked');
  };

  //ternary here?   animated ? animatedYears : userYears 
  let selectYears = (
    <>
      <select onChange={handleYearChange} defaultValue={animated ? animatedYears : yearValue} onSubmit={handleSubmit} >
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
      {/* <button onClick={handleAnimateClick} value={yearValue}>Animate Years</button> */}
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
        year={animated ? animatedYears : yearValue}
        id="MapChart" />
      <ReactTooltip 
        className={"Tooltip"} 
        backgroundColor={"lightblue"}
        textColor={"black"}
        border={true}
        html={true}>
          {content}
        </ReactTooltip>
    </div>

  );
}

export default MapContainer;
