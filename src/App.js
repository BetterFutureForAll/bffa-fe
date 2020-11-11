import React, { useState } from "react";
import ReactTooltip from "react-tooltip";
import './App.css';
import MapContainer from './containers/Map';
import { useSelector, useDispatch, connect } from 'react-redux';
import actions from './actions/contentActions';

function App(props) {

  return (
    <div className="App">
      <header className="App-header">
        <MapContainer {...props} />
      </header>
    </div>
  );
}
const mapStateToProps = (state) => {
  return {
    content: state.content
  }
};
const mapDispatchToProps = {
  ...actions
  //setToolip
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
