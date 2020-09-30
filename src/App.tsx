import React, { useEffect } from 'react';
import MapView from './components/MapView';
import SparkLineLayer, { ISparkLineData } from './components/SparkLineLayer';
// import { getPointValues } from './api/WCRCHydWebServerAPI';
import { getHilltopDataForSites } from './api/GWRCHillTopAPI';
import './App.css';
// import SPARKLINE_TEST_LAYER from './api/testPoints.json';
import GWRCHillTopSites from './api/GWRCHillTopSites.json';

function App() {
    const [sparkLineData, setSparkLineData] = React.useState<ISparkLineData>(
        []
    );
    const loadSparkLineData = async () => {
        const hillTopMeasurements = await getHilltopDataForSites(GWRCHillTopSites);
        console.log(hillTopMeasurements);
        setSparkLineData(hillTopMeasurements);
    };
    useEffect(() => {
        // getPointValues(492).then(results => console.log(results));
        loadSparkLineData();
    }, []);
    return (
        <div className="App">
            <MapView webmapId="dccd38078e4a451c935ab3e1f2a6e4d4">
                <SparkLineLayer
                    data={sparkLineData}
                    layerId={'ee61c3ba76074706bff5ae421649ce66'}
                ></SparkLineLayer>
            </MapView>
        </div>
    );
}

export default App;
