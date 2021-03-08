import React from 'react';
import MapChart from '../components/MapChart';
import ReactTooltip from 'react-tooltip';
import Header from '../components/Header';
import { 
  useHandleYearChange, 
  useYears, useContent, 
  useDataByYear, useCountries, 
  useHandleCountryChange,
  useD3
} from '../hooks/hooks';
import { useFlowersData } from '../hooks/flowerHook';
import FlowerMaker from '../components/FlowerMaker';

function MapContainer() {

  let [years] = useYears();
  let [content, setContent] = useContent();
  let [yearValue, handleYearChange] = useHandleYearChange();
  let [spiByYear]  = useDataByYear(yearValue);
  let [flowersData] = useFlowersData(spiByYear);
  let [countries] = useCountries();
  let [countryValue, handleCountryChange] = useHandleCountryChange();

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

  let selectCountries = (
    <select onChange={handleCountryChange} defaultValue={countryValue}>
      {countries.map(item => (
        <option key={item} value={item}>
          {item}
        </option>
      ))}
    </select>
    );

        
  return (
    <div id="MapContainer" >
      <div className="App-header">
        <Header 
          selectYears={selectYears} 
          yearValue={yearValue} 
          selectCountries={selectCountries}
          countryValue={countryValue}
        />
      </div>
      <MapChart 
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
      </ReactTooltip>
      <FlowerMaker 
        flowerData={flowersData} 
        countries={countries}
        countryValue={countryValue}
        handleCountryChange={handleCountryChange}
        useD3={useD3}
      />
    </div>

  );
}

export default MapContainer;
