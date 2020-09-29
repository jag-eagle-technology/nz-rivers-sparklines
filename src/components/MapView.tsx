// based on https://github.com/vannizhang/covid19-trend-map/blob/master/src/components/MapView/MapView.tsx
import React from 'react';

import { loadModules, loadCss } from 'esri-loader'; // needed due to dojo amd module system
import IMapView from 'esri/views/MapView';
import IWebMap from 'esri/WebMap';
import IwatchUtils from 'esri/core/watchUtils'; // for watching accessors (instance properties/mechanism for watching property changes)

export type MapCenterLocation = {
    lat: number;
    lon: number;
    zoom: number;
};

interface Props {
    webmapId: string;
    children?: React.ReactNode;
}

const MapView: React.FC<Props> = ({ webmapId, children }: Props) => {
    const mapDivRef = React.useRef<HTMLDivElement>(null);
    const [mapView, setMapView] = React.useState<IMapView>();

    const initMapView = async () => {
        type Modules = [typeof IMapView, typeof IWebMap];

        try {
            const [MapView, WebMap] = await (loadModules([
                'esri/views/MapView',
                'esri/WebMap',
            ]) as Promise<Modules>);
            if (!mapDivRef.current) {
                throw new Error('map div is not defined');
            }
            const view = new MapView({
                container: mapDivRef.current,
                center: undefined,
                zoom: undefined,
                map: new WebMap({
                    portalItem: {
                        id: webmapId
                    }
                })
            });
            view.when(() => {
                setMapView(view);
            });
        } catch (err) {
            console.log(err);
        }
    }

    React.useEffect(() => {
        loadCss();
        initMapView();
    }, []);

    return (
        <>
            <div
                style={{
                    position: 'absolute',
                    top: 0,
                    bottom: 0,
                    width: '100%',
                    height: '100%'
                }}
                ref={mapDivRef}
            ></div>
            {React.Children.map(children, (child) => {
                return React.cloneElement(child as React.ReactElement<any>, {
                    mapView,
                });
            })}
        </>
    )
}

export default MapView;