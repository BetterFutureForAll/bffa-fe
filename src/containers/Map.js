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
  const handleAnimateClick = () => {
    console.log('Button Clicked');
    //  set your counter to 1
    var i = 1;                  
  
    //  create a loop function
    //  call a 3s setTimeout when the loop is called
    function yearLoop() {        
      setTimeout(function() {   
        // let updatedYear = years[i];
        const event = new CustomEvent('build', years[i]);
        console.log(years);
        handleYearChange(event);
        //  increment the counter
        i++;                    
        //  if the counter < 10, call the loop function
        if(i < 10) {           
          //  ..  again which will trigger another 
          yearLoop();             
        }                       
        //  ..  setTimeout()
      }, 3000);
    }
  
    yearLoop(); 
  
  };



  return (
    <div id="MapContainer" >
      <div className="App-header">
        <Header 
          selectYears={selectYears} 
          yearValue={yearValue} 
          onSubmit={handleSubmit} 
        />
        <button onClick={handleAnimateClick}>Animate Years</button>
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
