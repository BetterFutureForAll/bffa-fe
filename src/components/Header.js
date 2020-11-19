import React from "react";

const Header = () => {

  //Years will have to come from SPI data as an array.
  var year = ['2020']
  return (
    <div>
      <label id="years">Select a year</label>
      <select >
        <option value={year}>{year}</option>
      </select>
    </div>
  );
}
export default Header;