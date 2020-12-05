import React, { memo } from "react";

const Header = ({ selectYears }) => {
  return (
    <div>
      <label id="years">Select a year </label>
        {selectYears}
    </div>
  );
}

export default Header;