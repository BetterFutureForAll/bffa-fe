import React from 'react';

const ControlBar = ({
  selectYears,
  yearValue,
  handleSubmit,
  selectCountries,
  handleCountryChange,
  countryValue,
  spiData
}) => {

  let scoreText = spiData ? spiData[0].score_spi : 0;

  return (
    <>
      <div className="select-countries-div">
        <form onSubmit={handleCountryChange}>
          <label id="country_list" value={countryValue} ></label>
          {selectCountries}
        </form>
        <h4 id='score-text'>{`${scoreText ? scoreText : "Partial"}`}</h4>
      </div>
      <form onSubmit={handleSubmit}>
        <label id="years" value={yearValue} ></label>
        {selectYears}
      </form>
    </>
  )
}

export default ControlBar;