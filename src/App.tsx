import React, { useEffect } from 'react';
import MapView from './components/MapView';
import SparkLineLayer, { ISparkLineData } from './components/SparkLineLayer';
// import { getPointValues } from './api/WCRCHydWebServerAPI';
import { getHilltopDataForSites, getHillTopSitesWithMeasurementType } from './api/GWRCHillTopAPI';
import './App.css';
// import SPARKLINE_TEST_LAYER from './api/testPoints.json';
import GWRCHillTopSites from './api/GWRCHillTopSites.json';

function App() {
    const [sparkLineData, setSparkLineData] = React.useState<ISparkLineData>(
        []
    );
    const loadSparkLineData = async () => {
        const GWRCHillTopFlowSites = await getHillTopSitesWithMeasurementType('Flow');
        // const GWRCHillTopFlowSites = GWRCHillTopSites;
        const hillTopMeasurements = await getHilltopDataForSites(GWRCHillTopFlowSites);
        // console.log(hillTopMeasurements.slice(1));
        console.log(hillTopMeasurements[0]);
        console.log(hillTopMeasurements[1]);
        setSparkLineData(hillTopMeasurements.filter(measurement => measurement.data.length > 0));
        // setSparkLineData(hillTopMeasurements);
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
