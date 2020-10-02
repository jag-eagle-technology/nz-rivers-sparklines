import React, { useEffect } from 'react';
import IMapView from 'esri/views/MapView';
import SparkLineLayer, { ISparkLineData } from './SparkLineLayer';
import {
    getHillTopSitesWithData,
    getHilltopDataForSitesWithDatatable,
} from '../api/HillTopAPI';
import { IMapToolTipLayer } from './MapToolTip';

interface IHilltopSparkLineLayer {
    mapView?: IMapView;
    hilltopURL: string;
    measurement: string;
    wkid?: number;
    color: number[];
    setToolTipLayer?: (layer: IMapToolTipLayer) => void;
}

const HilltopSparkLineLayer = ({
    mapView,
    hilltopURL,
    measurement,
    wkid = 2193,
    color,
    setToolTipLayer
}: IHilltopSparkLineLayer) => {
    const [sparkLineData, setSparkLineData] = React.useState<ISparkLineData>(
        []
    );
    const loadSparkLineData = async () => {
        var hillTopMeasurements = await getHillTopSitesWithData({
            hilltopURL,
            measurement,
        });
        hillTopMeasurements = hillTopMeasurements.map((measurement) => ({
            ...measurement,
            coordinates: { ...measurement.coordinates, wkid },
        }));
        setSparkLineData(
            hillTopMeasurements.filter(
                (measurement) => measurement.data.length > 0
            )
        );
    };
    useEffect(() => {
        loadSparkLineData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    return (
        <SparkLineLayer
            mapView={mapView}
            data={sparkLineData}
            color={color}
            id={`${hilltopURL} - ${measurement}`}
            setToolTipLayer={setToolTipLayer}
        />
    );
};

export default HilltopSparkLineLayer;
