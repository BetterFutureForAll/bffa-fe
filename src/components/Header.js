import React from "react";

// Year, and other Data Selections will have to be done here
// <Header> will need access to the CSV to make selections.

const Header = () => {
  var year = ['2020']
  return (
    <div>
      <label for="years">Select a year</label>
      <select >
        <option value={year}>{year}</option>
      </select>
    </div>
  );
}
export default Header;