import React from 'react';
import PropTypes from 'prop-types';

//refactor to  proper props, you know what you mean. 
const ControlBar = ({ selectYears, yearValue, handleSubmit, selectCountries, handleCountryChange, countryValue, spiData }) => {

  let scoreText = spiData ? spiData[0].score_spi : '';

  return (
    <>
      <div className="select-countries-div">
        <form onSubmit={handleCountryChange}>
          <label id="country_list" value={countryValue} ></label>
          {selectCountries}
        </form>
        <h3 id='score-text'>{`${scoreText}`}</h3>
      </div>
      <form onSubmit={handleSubmit}>
        <label id="years" value={yearValue} ></label>
        {selectYears}
      </form>
    </>
  )
}

ControlBar.propTypes = {
  selectYears: PropTypes.object,
  yearValue: PropTypes.string,
  handleSubmit: PropTypes.func,
};

export default ControlBar;