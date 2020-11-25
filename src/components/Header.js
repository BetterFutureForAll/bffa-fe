import React from "react";

const Header = ({ years }) => {
  //Years will have to come from SPI data as an array.
  let yearsOptions = years.map((year, i )=> {
    return <option key={year[i]} value={year}>{year}</option>
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