import React from 'react';
import DrawFlowers from './DrawFlowers';

const FlowerMaker = ({ flowerData, countryValue, useD3 }) => {

  return (
      <div id="FlowerMaker">
        <DrawFlowers 
          flowerData={flowerData} 
          countryValue={countryValue} 
          useD3={useD3}
          />
      </div>
    );
}

export default FlowerMaker;