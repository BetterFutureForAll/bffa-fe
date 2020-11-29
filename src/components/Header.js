import React from "react";

const Header = ({ years, handleYearChange, selectedYear }) => {
  //Years come in as an array.

//value needs to be controlled by Map.js
  return (
    <div>
      <label id="years">Select a year</label>
      <select value={selectedYear} onSelect={handleYearChange}>
        {years}
      </select>
    </div>
  );
}
export default Header;