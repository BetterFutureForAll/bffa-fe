import React from 'react';
import MapChart from '../components/MapChart';
import ReactTooltip from 'react-tooltip';
import Header from '../components/Header';

import { 
  useHandleYearChange, 
  useYears, useContent, 
  useDataByYear
} from '../hooks/hooks';

function MapContainer() {

  let [years] = useYears();
  let [content, setContent] = useContent();
  let [yearValue, handleYearChange] = useHandleYearChange();
  let [spiByYear]  = useDataByYear(yearValue);

  let handleSubmit = (e) => {
    e.preventDefault();
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
        onSubmit={handleSubmit} 
      />
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
