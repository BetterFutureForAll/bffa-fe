import React from 'react';
import PropTypes from 'prop-types';

const Header = ({ selectYears, yearValue, handleSubmit }) => {
  return (
    <form onSubmit={handleSubmit}>
      <label id="years" value={yearValue} >Select a year </label>
      {selectYears}
    </form>
  );
};

Header.propTypes = {
  selectYears: PropTypes.object,
  yearValue: PropTypes.string,
  handleSubmit: PropTypes.func
};

export default Header;
