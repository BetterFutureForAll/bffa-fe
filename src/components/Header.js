import React from "react";

const Header = ({ yearsOptions, handleYearChange, yearValue }) => {
  //Years come in as an array.
  //value needs to be controlled by Map.js
  
  return (
    <div>
      <label id="years">Select a year </label>
      <select value={yearValue} onChange={handleYearChange}>
        {yearsOptions}
      </select>
    </div>
  );
}
export default Header;