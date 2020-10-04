import React, { useEffect } from 'react';
import IMapView from 'esri/views/MapView';
import MapView from './components/MapView';
import HilltopSparkLineLayer from './components/HilltopSparkLineLayer';
import MapToolTip from './components/MapToolTip';
import { IMapToolTipLayer } from './components/MapToolTip';
import { ISparkLineData } from './components/SparkLineLayer';
import NivoLineGraph from './components/LineGraph/NivoLineGraph';
import './App.css';
function App() {
    const [selectedSite, setSelectedSite] = React.useState<string>();
    // fixme - type of any
    const getSiteData = (site: string, data: ISparkLineData): any => {
        return [
            {
                id: selectedSite,
                data: data
                    .find((value) => value.properties.site === selectedSite)
                    ?.data.map((datum) => ({
                        x: datum[0],
                        y: datum[1],
                    })),
            },
        ];
    };
    useEffect(() => {
        GWRCFlowLayerData &&
            selectedSite &&
            console.log(getSiteData(selectedSite, GWRCFlowLayerData));
    }, [selectedSite]);
    const [GWRCFlowLayer, setGWRCFlowLayer] = React.useState<
        IMapToolTipLayer
    >();
    const [GWRCFlowLayerData, setGWRCFlowLayerData] = React.useState<
        ISparkLineData
    >();
    const [HorizonsFlowLayer, setHorizonsFlowLayer] = React.useState<
        IMapToolTipLayer
    >();
    const tempGetArrayMapLayers = () => [
        ...(GWRCFlowLayer ? [GWRCFlowLayer] : []),
        ...(HorizonsFlowLayer ? [HorizonsFlowLayer] : []),
    ];
    const handleMapClick = (
        event: __esri.MapViewClickEvent,
        view: IMapView
    ) => {
        if (!tempGetArrayMapLayers()[0]) {
            return;
        }
        view.hitTest(event.screenPoint, {
            include: tempGetArrayMapLayers().map(({ layer }) => layer),
        }).then((features) => {
            // fixme - hardcoded id right now
            features.results[0] &&
                setSelectedSite(features.results[0].graphic.attributes.site);
        });
    };
    return (
        <div className="App">
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    width: '100%',
                    height: '100%',
                }}
            >
                <div style={{ flexGrow: 1 }}>
                    <MapView
                        webmapId="dccd38078e4a451c935ab3e1f2a6e4d4"
                        onClick={handleMapClick}
                    >
                        <MapToolTip layers={tempGetArrayMapLayers()} />
                        <HilltopSparkLineLayer
                            setToolTipLayer={setHorizonsFlowLayer}
                            hilltopURL="https://hilltopserver.horizons.govt.nz/data.hts"
                            measurement="Flow"
                            color={[45, 143, 255, 255]}
                            wkid={27200}
                        />
                        <HilltopSparkLineLayer
                            hilltopURL="https://corsflare.jag-eagle-technology.workers.dev/corsproxy/?apiurl=http://hilltop.gw.govt.nz/Data.hts"
                            measurement="Flow"
                            color={[45, 143, 255, 255]}
                            setToolTipLayer={setGWRCFlowLayer}
                            setData={setGWRCFlowLayerData}
                        />
                    </MapView>
                </div>
                <div style={{ height: '200px' }}>
                    {GWRCFlowLayerData && selectedSite && (
                        <NivoLineGraph
                            data={getSiteData(selectedSite, GWRCFlowLayerData)}
                        ></NivoLineGraph>
                    )}
                </div>
            </div>
        </div>
    );
}

export default App;
/*
                <HilltopSparkLineLayer
                    hilltopURL="https://corsflare.jag-eagle-technology.workers.dev/corsproxy/?apiurl=https://data.hbrc.govt.nz/Envirodata/EMAR.hts"
                    measurement="Stage"
                    color={[45, 143, 255, 255]}
                    wkid={27200}
                />


                <HilltopSparkLineLayer
                    hilltopURL="https://corsflare.jag-eagle-technology.workers.dev/corsproxy/?apiurl=http://hilltop.nrc.govt.nz/data.hts"
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
