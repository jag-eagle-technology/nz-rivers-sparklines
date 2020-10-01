import React, { useEffect } from 'react';
import IMapView from 'esri/views/MapView';
import ICIMSymbol from 'esri/symbols/CIMSymbol';
import IGraphic from 'esri/Graphic';
import IPoint from 'esri/geometry/Point';
import IGraphicsLayer from 'esri/layers/GraphicsLayer';
import ISpatialReference from 'esri/geometry/SpatialReference';
import { loadModules } from 'esri-loader';

export interface ISparkLinePoint {
    coordinates: { x: number; y: number; wkid: number };
    properties: any;
    data: [string, number][];
}

export interface ISparkLineData extends Array<ISparkLinePoint> {}

interface ISparkLineLayer {
    data: ISparkLineData;
    mapView?: IMapView;
    color: number[];
    id: string;
    setPopupTitle?: React.Dispatch<React.SetStateAction<string | undefined>>;
}

const SparkLineLayer: React.FC<ISparkLineLayer> = ({
    mapView,
    data,
    color,
    id,
    setPopupTitle,
}) => {
    const [trendLayer, setTrendLayer] = React.useState<IGraphicsLayer>();
    const initLayer = async () => {
        type Modules = [typeof IGraphicsLayer, typeof ISpatialReference];
        try {
            if (!mapView) {
                throw new Error('no map set');
            }
            const [GraphicsLayer] = await (loadModules([
                'esri/layers/GraphicsLayer',
                'esri/geometry/SpatialReference',
            ]) as Promise<Modules>);

            const layer = new GraphicsLayer({
                visible: false,
                id,
            });
            mapView.map.add(layer);
            setTrendLayer(layer);
            if (setPopupTitle) {
                mapView.on('pointer-move', (evt) => {
                    mapView.hitTest(evt, { include: layer }).then((value) => {
                        value.results[0] &&
                            setPopupTitle(
                                value.results[0].graphic.attributes.site
                            );
                    });
                });
            }
        } catch (err) {
            console.log(err);
        }
    };
    const drawLayer = async () => {
        type Modules = [
            typeof ICIMSymbol,
            typeof IGraphic,
            typeof IPoint,
            typeof ISpatialReference
        ];
        try {
            if (!mapView) {
                throw new Error('no map set');
            }
            if (!trendLayer) {
                throw new Error('no layer set');
            }
            const [
                CIMSymbol,
                Graphic,
                Point,
                SpatialReference,
            ] = await (loadModules([
                'esri/symbols/CIMSymbol',
                'esri/Graphic',
                'esri/geometry/Point',
                'esri/geometry/SpatialReference',
            ]) as Promise<Modules>);
            console.dir(data);
            const sparkLineGraphics = data.map((sparkLinePoint) => {
                const ymax = sparkLinePoint.data
                    .map((i) => i[1])
                    .reduce(
                        (prev, curr) => Math.max(prev, curr),
                        Number.NEGATIVE_INFINITY
                    );
                const xmax = ymax;
                const ratio = xmax / (sparkLinePoint.data.length - 1);
                const path = sparkLinePoint.data
                    .map((i) => i[1])
                    .map((num, index) => {
                        const x = index * ratio;
                        const y = num;
                        return [x, y];
                    });
                const geometry = new Point({
                    x: sparkLinePoint.coordinates.x,
                    y: sparkLinePoint.coordinates.y,
                    spatialReference: new SpatialReference({
                        wkid: sparkLinePoint.coordinates.wkid,
                    }),
                });
                const symbol = new CIMSymbol({
                    data: {
                        type: 'CIMSymbolReference',
                        symbol: {
                            type: 'CIMPointSymbol',
                            symbolLayers: [
                                {
                                    type: 'CIMVectorMarker',
                                    enable: true,
                                    // defines the height of the marker. Modifying Size property actually changes the marker's height to the specified size and the width of marker is updated proportionally.
                                    size: 32,
                                    // an envelope which is a rectangle defined by a range of values for each coordinate and attribute
                                    frame: {
                                        xmin: 0,
                                        ymin: 0,
                                        xmax,
                                        ymax,
                                    },
                                    markerGraphics: [
                                        {
                                            type: 'CIMMarkerGraphic',
                                            geometry: {
                                                paths: [path],
                                            },
                                            symbol: {
                                                type: 'CIMLineSymbol',
                                                symbolLayers: [
                                                    {
                                                        type: 'CIMSolidStroke',
                                                        width: 1.5,
                                                        color,
                                                    },
                                                ],
                                            },
                                        },
                                    ],
                                },
                            ],
                        },
                    },
                });
                return new Graphic({
                    geometry,
                    symbol,
                    attributes: { ...sparkLinePoint.properties },
                });
            });
            if (sparkLineGraphics.length > 0) {
                trendLayer.visible = true;
                trendLayer.addMany(sparkLineGraphics);
            } else {
                trendLayer.visible = false;
            }
        } catch (err) {
            console.log(err);
        }
    };
    useEffect(() => {
        initLayer();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [mapView]);
    useEffect(() => {
        if (trendLayer) {
            trendLayer.removeAll();
            drawLayer();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [trendLayer, data]);
    return null;
};

export default SparkLineLayer;
