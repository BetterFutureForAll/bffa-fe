import React from "react";
import './App.css';
import MapContainer from './containers/Map';
import { useSelector, useDispatch, connect } from 'react-redux';
import { setContent, SET_CONTENT }from './actions/contentActions';


function App() {
  const dispatch = useDispatch();
  const controlContent = useSelector(state => state.content);

  return (
    <div className="App">
        <MapContainer />
    </div>
  );
}
// const mapStateToProps = state => ({
//   content: state.content,
//   scores: state.scores
// });

// const mapDispatchToProps = dispatch => {
//   return{
//     setToolTipContent: ()=> dispatch({ type: SET_CONTENT })
//   }
// };

export default connect(
  // mapStateToProps,
  // mapDispatchToProps
)(App);
