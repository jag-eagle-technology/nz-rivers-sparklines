import React, { useEffect } from 'react';
import IMapView from 'esri/views/MapView';
import SparkLineLayer, { ISparkLineData } from './SparkLineLayer';
import { getHillTopSitesWithData } from '../api/HillTopAPI';

interface IHilltopSparkLineLayer {
    mapView?: IMapView;
    hilltopURL: string;
    measurement: string;
    color: number[];
}

const HilltopSparkLineLayer = ({
    mapView,
    hilltopURL,
    measurement,
    color
}: IHilltopSparkLineLayer) => {
    const [sparkLineData, setSparkLineData] = React.useState<ISparkLineData>(
        []
    );
    const loadSparkLineData = async () => {
        const hillTopMeasurements = await getHillTopSitesWithData({
            hilltopURL,
            measurement,
        });
        console.log('data returned is');
        console.log(hillTopMeasurements);
        setSparkLineData(
            hillTopMeasurements.filter(
                (measurement) => measurement.data.length > 0
            )
        );
    };
    useEffect(() => {
        loadSparkLineData();
    }, []);
    return (
        <SparkLineLayer
            mapView={mapView}
            data={sparkLineData}
            color={color}
        />
    );
};

export default HilltopSparkLineLayer;
