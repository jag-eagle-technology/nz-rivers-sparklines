import React from 'react';
import IMapView from 'esri/views/MapView';
import ILayer from 'esri/layers/Layer';
import IGraphic from 'esri/Graphic';
// __esri.MapViewClickEvent

export interface IMapToolTipLayer {
    layer: ILayer;
    title: (graphic: IGraphic) => string;
    body: (graphic: IGraphic) => string;
}

interface IMapToolTip {
    mapView?: IMapView;
    layers: IMapToolTipLayer[];
    onClick?: __esri.MapViewClickEventHandler;
}

const MapToolTip: React.FC<IMapToolTip> = ({ mapView, layers, onClick }) => {
    // get mapview.container
    // get mouse position
    // set position of tooltip
    const [mousePosition, setMousePosition] = React.useState<{
        x: number;
        y: number;
    }>();
    const [title, setTitle] = React.useState<string>();
    /*
    if (setPopupTitle) {
        mapView.on('pointer-move', (evt) => 
    }
    */
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
                        console.log(value);
                        if (value.results[0]) {
                            const tooltipLayer = layers.find(
                                (tooltipLayer) =>
                                    tooltipLayer.layer.id ==
                                    value.results[0].graphic.layer.id
                            );
                            console.log(tooltipLayer);
                            if (tooltipLayer) {
                                setTitle(
                                    tooltipLayer.title(value.results[0].graphic)
                                );
                            }
                        } else {
                            setTitle(undefined);
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
                        height: '100%',
                        width: '100%',
                        pointerEvents: 'none',
                        overflow: 'hidden',
                    }}
                >
                    <div
                        style={{
                            position: 'relative',
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
                    </div>
                </div>
            )}
        </>
    );
};

export default MapToolTip;
