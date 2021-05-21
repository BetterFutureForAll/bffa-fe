import React from 'react';
import DrawFlowers from './DrawFlowers';

const FlowerMaker = ({ flowerData, countryValue }) => {

  return (
      <div id="FlowerMaker">
        <DrawFlowers 
          flowerData={flowerData} 
          countryValue={countryValue} 
          />
      </div>
    );
}

export default FlowerMaker;