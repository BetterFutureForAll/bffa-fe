import React from "react";

const Header = ({ years }) => {

  //Years will have to come from SPI data as an array.
  let yearsOptions = years.forEach(year => {
    return <option value={year}>{year}</option>
  });


  return (
    <div>
      <label id="years">Select a year</label>
      <select >
        {yearsOptions}
      </select>
    </div>
  );
}
export default Header;