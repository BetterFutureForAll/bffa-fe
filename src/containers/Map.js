import React from 'react';
import MapChart from '../components/MapChart';
import ReactTooltip from "react-tooltip";
import Header from '../components/Header';

// import { getContent } from '../selectors/contentSelector';
// import * as spiData from '../assets/2011-2020-Social-Progress-Index.csv'
// import { spi2020, makeYearsArray } from '../services/SocialProgress';

import { useHandleYearChange, useYears, useContent, useDataByYear } from '../hooks/hooks';

function MapContainer() {

  let [years] = useYears();
  let [content, setContent] = useContent();
  let [yearValue, handleYearChange] = useHandleYearChange();
  let [spiByYear]  = useDataByYear(yearValue);

  let handleSubmit = (e) => {
    e.preventDefault();
    // spiByYear;
    console.log(spiByYear);
    console.log((yearValue));
  };

  let selectYears = (
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
  );

  return (
    <div id="MapContainer" >
      <Header 
        selectYears={selectYears} 
        yearValue={yearValue} 
        onSubmit={handleSubmit}/>
      <MapChart 
        setTooltipContent={setContent} 
        year={yearValue}
        data={spiByYear} 
        id="MapChart" />
      <ReactTooltip>{content}</ReactTooltip>
    </div>

  )
};

export default MapContainer;
