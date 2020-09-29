import React from 'react';
import MapView from './components/MapView';
import SparkLineLayer, {ISparkLineData} from './components/SparkLineLayer';
import './App.css';
import SPARKLINE_TEST_LAYER from './api/testPoints.json';

function App() {
  return (
    <div className="App">
      <MapView webmapId='dccd38078e4a451c935ab3e1f2a6e4d4'><SparkLineLayer data={SPARKLINE_TEST_LAYER as ISparkLineData} layerId={'ee61c3ba76074706bff5ae421649ce66'}></SparkLineLayer></MapView>
    </div>
  );
}

export default App;
