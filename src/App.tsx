import React from 'react';
import IMapView from 'esri/views/MapView';
import MapView from './components/MapView';
import IGraphicsLayer from 'esri/layers/GraphicsLayer';
import HilltopSparkLineLayer from './components/HilltopSparkLineLayer';
import MapToolTip from './components/MapToolTip';
import { getToolTipInfo } from './components/MapToolTip';
import { ISparkLineData } from './components/SparkLineLayer';
import NivoLineGraph from './components/LineGraph/NivoLineGraph';
import './App.css';
function App() {
    const [selectedSite, setSelectedSite] = React.useState<{
        id: string;
        layerId: string;
    }>();
    // fixme - type of any
    const getSiteData = (selectedSite: {
        id: string;
        layerId: string;
    }): any => {
        var data;
        if (selectedSite.layerId == GWRCFlowLayer?.id) {
            data = GWRCFlowLayerData;
        }
        if (selectedSite.layerId == HorizonsFlowLayer?.id) {
            data = HorizonsFlowData;
        }
        if (!data) {
            return;
        }
        return [
            {
                id: selectedSite.id,
                data: data
                    .find((value) => value.properties.id === selectedSite.id)
                    ?.data.map((datum) => ({
                        x: datum[0],
                        y: datum[1],
                    })),
            },
        ];
    };

    const [GWRCFlowLayer, setGWRCFlowLayer] = React.useState<IGraphicsLayer>();
    const [GWRCFlowLayerData, setGWRCFlowData] = React.useState<
        ISparkLineData
    >();
    const [GetGWRCToolTipDetails, setGetGWRCToolTipDetails] = React.useState<
        getToolTipInfo
    >();
    const [HorizonsFlowLayer, setHorizonsFlowLayer] = React.useState<
        IGraphicsLayer
    >();
    const [HorizonsFlowData, setHorizonsFlowData] = React.useState<
        ISparkLineData
    >();
    const [
        GetHorizonsToolTipDetails,
        setGetHorizonsToolTipDetails,
    ] = React.useState<getToolTipInfo>();
    const tempGetArrayMapLayers = () => [
        ...(GWRCFlowLayer && GetGWRCToolTipDetails
            ? [{ layer: GWRCFlowLayer, getInfo: GetGWRCToolTipDetails }]
            : []),
        ...(HorizonsFlowLayer && GetHorizonsToolTipDetails
            ? [
                  {
                      layer: HorizonsFlowLayer,
                      getInfo: GetHorizonsToolTipDetails,
                  },
              ]
            : []),
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
            console.log(features.results);
            features.results[0] &&
                setSelectedSite({
                    id: features.results[0].graphic.attributes.id,
                    layerId: features.results[0].graphic.layer.id,
                });
        });
    };
    React.useEffect(() => {
        console.log(selectedSite);
        selectedSite && console.log(getSiteData(selectedSite));
    });
    return (
        <div className="App">
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    width: '100%',
                    height: '100%',
                    background: '#1d2224',
                }}
            >
                <div style={{ flexGrow: 1, position: 'relative' }}>
                    <MapView
                        webmapId="dccd38078e4a451c935ab3e1f2a6e4d4"
                        onClick={handleMapClick}
                    >
                        <MapToolTip layers={tempGetArrayMapLayers()} />
                        <HilltopSparkLineLayer
                            hilltopURL="https://hilltopserver.horizons.govt.nz/data.hts"
                            measurement="Flow"
                            color={[45, 143, 255, 255]}
                            wkid={27200}
                            setLayer={setHorizonsFlowLayer}
                            setData={setHorizonsFlowData}
                            setGetToolTipDetails={setGetHorizonsToolTipDetails}
                        />
                        <HilltopSparkLineLayer
                            hilltopURL="https://corsflare.jag-eagle-technology.workers.dev/?http://hilltop.gw.govt.nz/Data.hts"
                            measurement="Flow"
                            color={[45, 143, 255, 255]}
                            setLayer={setGWRCFlowLayer}
                            setData={setGWRCFlowData}
                            setGetToolTipDetails={setGetGWRCToolTipDetails}
                        />
                    </MapView>
                    {selectedSite && getSiteData(selectedSite) && (
                        <div
                            style={{
                                position: 'absolute',
                                bottom: 25,
                                left: 25,
                                right: 25,
                                height: 200,
                                background: '#3a4042',
                                borderRadius: 5,
                                boxShadow: '0px 0px 10px 2px rgba(0,0,0,0.3)',
                            }}
                        >
                            <div
                                style={{
                                    textAlign: 'center',
                                    fontWeight: 'bold',
                                    color: 'white',
                                    fontSize: '24px',
                                    height: '50px',
                                    lineHeight: '50px'
                                }}
                            >
                                {selectedSite.id}
                            </div>
                            <div style={{ height: '150px' }}>
                                <NivoLineGraph
                                    data={getSiteData(selectedSite)}
                                ></NivoLineGraph>
                            </div>
                        </div>
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
