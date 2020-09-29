import React from 'react';
import IMapView from 'esri/views/MapView';
import ICIMSymbol from 'esri/symbols/CIMSymbol';
import IGraphic from 'esri/Graphic';
import IPoint from 'esri/geometry/Point';
import IGraphicsLayer from 'esri/layers/GraphicsLayer';
import ILayer from 'esri/layers/Layer';
import IPortalItem from 'esri/portal/PortalItem';
import { loadModules } from 'esri-loader';

interface SparkLineLayerProps {
    data: any,
    layerId: string,
    mapView?: IMapView
}

const SparkLineLayer: React.FC<SparkLineLayerProps> = ({ mapView, layerId, data }) => {
    const [trendLayer, setTrendLayer] = React.useState<IGraphicsLayer>();
    const initLayer = async () => {
        type Modules = [typeof IGraphicsLayer]
        try {
            if (!mapView) {
                throw new Error("no map set");
            }
            const [GraphicsLayer] = await (loadModules(['esri/layers/GraphicsLayer']) as Promise<Modules>);

            const layer = new GraphicsLayer({ visible: false });
            mapView.map.add(layer);
            setTrendLayer(layer);
        } catch (err) {
            console.log(err);
        }
    }
    const drawLayer = async () => {
        type Modules = [typeof ICIMSymbol, typeof IGraphic, typeof IPoint, typeof ILayer, typeof IPortalItem];
        try {
            if (!mapView) {
                throw new Error("no map set");
            }
            const [CIMSymbol, Graphic, Point, Layer, PortalItem] = await (loadModules([
                'esri/symbols/CIMSymbol',
                'esri/Graphic',
                'esri/geometry/Point',
                'esri/layers/Layer',
                'esri/portal/PortalItem'
            ]) as Promise<Modules>);
            const symbol = new CIMSymbol({
                data: {
                    type: "CIMSymbolReference",
                    symbol: {
                        type: "CIMPointSymbol",
                        symbolLayers: [{
                            type: "CIMVectorMarker",
                            enable: true,
                            // defines the height of the marker. Modifying Size property actually changes the marker's height to the specified size and the width of marker is updated proportionally.
                            size: 32,
                            // an envelope which is a rectangle defined by a range of values for each coordinate and attribute
                            frame: {
                                xmin: 0,
                                ymin: 0,
                                xmax: 16,
                                ymax: 16
                            },
                            markerGraphics: [{
                                type: "CIMMarkerGraphic",
                                geometry: {
                                    paths: [
                                        [
                                            [0, 0],
                                            [8, 16],
                                            [16, 0]
                                        ]
                                    ]
                                },
                                symbol: {
                                    type: "CIMLineSymbol",
                                    symbolLayers: [{
                                        type: "CIMSolidStroke",
                                        width: 5,
                                        color: [240, 94, 35, 255]
                                    }]
                                }
                            }]
                        }]
                    }
                }
            });
            const sparkLinePortalItem = await new PortalItem({id: layerId});
            const sparkLineLayer = await Layer.fromPortalItem({ 
                portalItem: sparkLinePortalItem
            });
            sparkLineLayer.
            
            // mapView.map.add(layer)
        } catch (err) {
            console.log(err);
        }
    }
    return null;
}

export default SparkLineLayer;