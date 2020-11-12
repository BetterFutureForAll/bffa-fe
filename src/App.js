import React from "react";
import './App.css';
import MapContainer from './containers/Map';
import { connect } from 'react-redux';
import { setContent }from './actions/contentActions';

function App() {

  return (
    <div className="App">
        <MapContainer />
    </div>
  );
}
const mapStateToProps = state => ({
  content: state.content,
  scores: state.scores
});

const mapDispatchToProps = { setContent };

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
