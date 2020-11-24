import React from "react";
import './App.css';
import MapContainer from './containers/Map';

function App() {
  const dispatch = useDispatch();
  const controlContent = useSelector(state => state.content);

  return (
    <div className="App">
        <MapContainer />
    </div>
  );
}

export default App;
