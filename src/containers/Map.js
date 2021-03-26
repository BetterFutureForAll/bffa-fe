import React, { useRef, useEffect } from 'react';
import MapChart from '../components/MapChart';
import ReactTooltip from 'react-tooltip';
import Header from '../components/Header';
import { 
  useHandleYearChange, 
  useYears, useContent, 
  useDataByYear, useCountries, 
  useHandleCountryChange, useFlowers, 
  useSingleFlower, useDataByCountry, useD3
} from '../hooks/hooks';
import { useFlowersData } from '../hooks/flowerHook';
import DrawFlowers from '../components/DrawFlowers';
import { spi2020 } from '../services/SocialProgress';
import { svg } from 'd3';

function MapContainer() {
  const svgRef = useRef(null);
  let petalSize = 50;

  let [content, setContent] = useContent();

  let [years] = useYears();
  let [yearValue, handleYearChange] = useHandleYearChange();
  let [spiByYear]  = useDataByYear(yearValue);

  let [countries] = useCountries();
  let [countryValue, handleCountryChange] = useHandleCountryChange();
  let [spiByCountry] = useDataByCountry(spiByYear, countryValue);

  // let [flowersData] = useFlowersData(spiByCountry);
  // let [flowers, setFlowers] = useFlowers(flowersData, svgRef, petalSize)

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
    <>
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
        handleCountryChange={handleCountryChange}
        countryValue={countryValue}
        svgRef={svgRef}
        id="MapChart" />
        <ReactTooltip 
        className={"Tooltip"} 
        backgroundColor={"lightgrey"}
        textColor={"black"}
        border={true}
        html={true}>
      {content}
      </ReactTooltip>
  </div>

</>
  );
}

export default MapContainer;
