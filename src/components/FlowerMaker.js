import React from 'react';
import { useCountries, useHandleCountryChange } from '../hooks/hooks';
import DrawFlowers from './DrawFlowers';

const FlowerMaker = ({ spiByYear }) => {

  let [countries] = useCountries();
  let [countryValue, handleCountryChange] = useHandleCountryChange();

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
      <div id="FlowerMaker">
        <h2>{selectCountries}</h2>
        <DrawFlowers spiByYear={spiByYear}></DrawFlowers>
      </div>
    );
}

export default FlowerMaker;