import React, { useState } from 'react';
import MapChart from '../components/MapChart';
import ReactTooltip from 'react-tooltip';
import Header from '../components/Header';
import { 
  useHandleYearChange, 
  useYears, useContent, 
  useDataByYear,
} from '../hooks/hooks';
import FlowerMaker from '../components/FlowerMaker';
import MapMaker from '../components/MapMaker';

function MapContainer() {

  let [years] = useYears();
  let [content, setContent] = useContent();
  let [yearValue, handleYearChange] = useHandleYearChange();
  let [spiByYear]  = useDataByYear(yearValue);

  let selectYears = (
    <>
      <select onChange={handleYearChange} defaultValue={yearValue} >
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
    </>
  );
        
  return (
    <div id="MapContainer" >
      <div className="App-header">
        <Header 
          selectYears={selectYears} 
          yearValue={yearValue} 
        />
      </div>
      <FlowerMaker spiByYear={spiByYear}></FlowerMaker>
      {/* <MapChart 
        setTooltipContent={setContent} 
        data={spiByYear} 
        year={yearValue}
        id="MapChart" />
        <ReactTooltip 
        className={"Tooltip"} 
        backgroundColor={"lightgrey"}
        textColor={"black"}
        border={true}
        html={true}>
        {content}
      </ReactTooltip> */}
    </div>

  );
}

export default MapContainer;
