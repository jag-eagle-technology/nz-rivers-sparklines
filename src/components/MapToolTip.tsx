import React from 'react';
import IMapView from 'esri/views/MapView';
import ILayer from 'esri/layers/Layer';
import IGraphic from 'esri/Graphic';

export interface IMapToolTipLayer {
    layer: ILayer;
    title: (graphic: IGraphic) => string;
    body: (graphic: IGraphic) => string;
}

interface IMapToolTip {
    mapView?: IMapView;
    layers: IMapToolTipLayer[];
}

const MapToolTip: React.FC<IMapToolTip> = ({ mapView, layers }) => {
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
        const pointerMoveListener = mapView.on('pointer-move', (evt) => {
            setMousePosition({ x: evt.x, y: evt.y });
            mapView
                .hitTest(evt, {
                    include: layers.map((i) => i.layer),
                })
                .then((value) => {
                    if (value.results) {
                        setTitle(value.results[0].graphic.attributes.site);
                    } else {
                        setTitle(undefined);
                        setMousePosition(undefined);
                    }
                });
        });
        const pointerLeaveListener = mapView.on('pointer-leave', (evt) => setMousePosition(undefined));
        return [pointerMoveListener, pointerLeaveListener];
    };
    React.useEffect(() => {
        const listeners = initListeners();
        return (() => listeners && listeners.forEach(listener => listener.remove()));
    }, [mapView, layers]);
    return (
        <>
            {mousePosition && title && (
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
            )}
        </>
    );
};

export default MapToolTip;
