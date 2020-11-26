import React from "react";

const Header = ({ years, handleYearChange, selectedYear }) => {
  //Years will have to come from SPI data as an array.

  return (
    <div>
      <label id="years">Select a year</label>
      <select value={selectedYear} onChange={handleYearChange}>
        {years}
      </select>
    </div>
  );
}
export default Header;