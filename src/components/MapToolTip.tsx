import React from 'react';
import IMapView from 'esri/views/MapView';

interface IMapToolTip {
    mapView?: IMapView;
    title?: string;
}

const MapToolTip: React.FC<IMapToolTip> = ({ mapView, title }) => {
    // get mapview.container
    // get mouse position
    // set position of tooltip
    const [mousePosition, setMousePosition] = React.useState<{
        x: number;
        y: number;
    }>();
    const initTooltip = () => {
        if (!mapView) {
            return;
        }
        mapView.on('pointer-move', (evt) =>
            setMousePosition({ x: evt.x, y: evt.y })
        );
        mapView.on('pointer-leave', (evt) => setMousePosition(undefined));
    };
    React.useEffect(() => {
        initTooltip();
    }, [mapView]);
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
                            fontWeight: 'bold'
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
