import React from 'react';
import MapView from './components/MapView';
import SparkLineLayer from './components/SparkLineLayer';
import './App.css';

function App() {
  const SPARKLINE_TEST_LAYER = [
    [
      [0, 5],
      [10, 40],
      [20, 15],
      [30, 25],
      [40, 10]
    ]
 ];
  return (
    <div className="App">
      <MapView webmapId='dccd38078e4a451c935ab3e1f2a6e4d4'><SparkLineLayer data={null} layerId={'ee61c3ba76074706bff5ae421649ce66'}></SparkLineLayer></MapView>
    </div>
  );
}

export default App;
