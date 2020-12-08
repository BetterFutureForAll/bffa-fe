import React, { memo } from "react";

const Header = ({ selectYears, yearValue, handleSubmit }) => {
  return (
    <form onSubmit={handleSubmit}>
      <label id="years" value={yearValue} >Select a year </label>
        {selectYears}
    </form>
  );
}

export default Header;