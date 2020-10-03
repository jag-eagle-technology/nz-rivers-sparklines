import React from 'react';
import IMapView from 'esri/views/MapView';
import ILayer from 'esri/layers/Layer';
import IGraphic from 'esri/Graphic';

export interface IMapToolTipLayer {
    layer: ILayer;
    getTitle: (graphic: IGraphic) => string;
    getBody: (graphic: IGraphic) => string;
}

interface IMapToolTip {
    mapView?: IMapView;
    layers: IMapToolTipLayer[];
    onClick?: __esri.MapViewClickEventHandler;
    setLayerId?: React.Dispatch<React.SetStateAction<string | undefined>>;
    setFeatureId?: React.Dispatch<React.SetStateAction<string | undefined>>;
}

const MapToolTip: React.FC<IMapToolTip> = ({
    mapView,
    layers,
    onClick,
    setLayerId,
    setFeatureId,
}) => {
    const [mousePosition, setMousePosition] = React.useState<{
        x: number;
        y: number;
    }>();
    const [title, setTitle] = React.useState<string>();
    const [body, setBody] = React.useState<string>(); // update to include components
    const initListeners = () => {
        if (!mapView) {
            return;
        }
        const events = [];
        events.push(
            mapView.on('pointer-move', (evt) => {
                setMousePosition({ x: evt.x, y: evt.y });
                mapView
                    .hitTest(evt, {
                        include: layers.map((i) => i.layer),
                    })
                    .then((value) => {
                        if (value.results[0]) {
                            const tooltipLayer = layers.find(
                                (tooltipLayer) =>
                                    tooltipLayer.layer.id ==
                                    value.results[0].graphic.layer.id
                            );
                            if (tooltipLayer) {
                                setTitle(
                                    tooltipLayer.getTitle(
                                        value.results[0].graphic
                                    )
                                );
                                setBody(
                                    tooltipLayer.getBody(
                                        value.results[0].graphic
                                    )
                                );
                                setFeatureId &&
                                    setFeatureId(
                                        value.results[0].graphic.attributes
                                            .id || undefined
                                    );
                                setLayerId &&
                                    setLayerId(
                                        value.results[0].graphic.layer.id ||
                                            undefined
                                    );
                            }
                        } else {
                            setTitle(undefined);
                            setBody(undefined);
                            setMousePosition(undefined);
                        }
                    });
            })
        );
        events.push(
            mapView.on('pointer-leave', (evt) => setMousePosition(undefined))
        );
        if (onClick) {
            events.push(mapView.on('click', onClick));
        }
        return events;
    };
    React.useEffect(() => {
        const listeners = initListeners();
        return () =>
            listeners && listeners.forEach((listener) => listener.remove());
    }, [mapView, layers, onClick]);
    return (
        <>
            {mousePosition && title && (
                <div
                    style={{
                        top: 0,
                        left: 0,
                        height: '100%',
                        width: '100%',
                        position: 'absolute',
                        pointerEvents: 'none',
                        overflow: 'hidden',
                    }}
                >
                    <div
                        style={{
                            position: 'absolute',
                            height: 180,
                            width: 300,
                            left: `${mousePosition?.x + 5}px`,
                            top: `${mousePosition?.y + 5}px`,
                            background: 'rgb(235, 244, 255)',
                            pointerEvents: 'none',
                            boxShadow: '0px 0px 10px 2px rgba(0,0,0,0.3)',
                            borderRadius: '3px',
                            overflow: 'hidden',
                        }}
                    >
                        <div
                            style={{
                                padding: '5px 15px',
                                background: 'rgb(217, 234, 255)',
                                color: 'rgb(0, 84, 181)',
                                fontWeight: 'bold',
                            }}
                        >
                            {title}
                        </div>
                        {body}
                    </div>
                </div>
            )}
        </>
    );
};

export default MapToolTip;
