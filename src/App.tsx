import React, { useEffect } from 'react';
import MapView from './components/MapView';
import HilltopSparkLineLayer from './components/HilltopSparkLineLayer';
import './App.css';
function App() {
    return (
        <div className="App">
            <MapView webmapId="dccd38078e4a451c935ab3e1f2a6e4d4">
                <HilltopSparkLineLayer
                    hilltopURL="http://hilltop.gw.govt.nz/Data.hts"
                    measurement="Flow"
                    color={[45, 143, 255, 255]}
                />
            </MapView>
        </div>
    );
}

export default App;
/*
                <HilltopSparkLineLayer
                    hilltopURL="https://hilltopserver.horizons.govt.nz/data.hts"
                    measurement="Flow"
                    color={[45, 143, 255, 255]}
                />
                <HilltopSparkLineLayer
                    hilltopURL="https://data.hbrc.govt.nz/Envirodata/EMAR.hts"
                    measurement="Flow"
                    color={[45, 143, 255, 255]}
                />
                <HilltopSparkLineLayer
                    hilltopURL="http://hilltop.nrc.govt.nz/data.hts"
                    measurement="Flow"
                    color={[45, 143, 255, 255]}
                />
*/
/*
                <HilltopSparkLineLayer
                    hilltopURL="http://hilltop.gw.govt.nz/Data.hts"
                    measurement="Rainfall"
                    color={[158, 203, 255, 255]}
                />
                <HilltopSparkLineLayer
                    hilltopURL="http://hilltop.gw.govt.nz/Data.hts"
                    measurement="Air Temperature"
                    color={[255, 56, 46, 255]}
                />
                <HilltopSparkLineLayer
                    hilltopURL="http://hilltop.gw.govt.nz/Data.hts"
                    measurement="Wind Speed"
                    color={[255, 199, 46, 255]}
                />
*/
