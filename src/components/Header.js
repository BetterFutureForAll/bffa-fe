import React from "react";

export default Header = ({ years }) => {
  return (
    <div>
      <label for="years">Select a year</label>
      <select >
        <option value={year}>{year}</option>
      </select>
    </div>
  );

}