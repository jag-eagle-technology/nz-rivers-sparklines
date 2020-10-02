import React from 'react';
import MapView from './components/MapView';
import HilltopSparkLineLayer from './components/HilltopSparkLineLayer';
import MapToolTip from './components/MapToolTip';
import { IMapToolTipLayer } from './components/MapToolTip';
import './App.css';
function App() {
    const [popupTitle, setPopupTitle] = React.useState<string>();
    const [GWRCFlowLayer, setGWRCFlowLayer] = React.useState<
        IMapToolTipLayer
    >();
    return (
        <div className="App">
            <div style={{ display: 'flex', width: '100%', height: '100%' }}>
                <div style={{ width: '400px' }}></div>
                <div>
                    <MapView webmapId="dccd38078e4a451c935ab3e1f2a6e4d4">
                        <MapToolTip
                            layers={[...(GWRCFlowLayer ? [GWRCFlowLayer] : [])]}
                        />
                        {/*                         
                        <HilltopSparkLineLayer
                            setPopupTitle={setPopupTitle}
                            hilltopURL="https://hilltopserver.horizons.govt.nz/data.hts"
                            measurement="Flow"
                            color={[45, 143, 255, 255]}
                            wkid={27200}
                        />
                        */}
                        <HilltopSparkLineLayer
                            hilltopURL="http://hilltop.gw.govt.nz/Data.hts"
                            measurement="Flow"
                            color={[45, 143, 255, 255]}
                            setToolTipLayer={setGWRCFlowLayer}
                        />
                    </MapView>
                </div>
            </div>
        </div>
    );
}

export default App;
/*

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
