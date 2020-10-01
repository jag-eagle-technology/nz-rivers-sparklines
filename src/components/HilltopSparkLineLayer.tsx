import React, { useEffect } from 'react';
import IMapView from 'esri/views/MapView';
import SparkLineLayer, { ISparkLineData } from './SparkLineLayer';
import { getHillTopSitesWithData, getHilltopDataForSitesWithDatatable } from '../api/HillTopAPI';

interface IHilltopSparkLineLayer {
    mapView?: IMapView;
    hilltopURL: string;
    measurement: string;
    wkid?: number;
    color: number[];
    setPopupTitle?: React.Dispatch<React.SetStateAction<string | undefined>>;
}

const HilltopSparkLineLayer = ({
    mapView,
    hilltopURL,
    measurement,
    wkid = 2193,
    color,
    setPopupTitle
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
        <SparkLineLayer mapView={mapView} data={sparkLineData} color={color} id={`${hilltopURL} - ${measurement}`} setPopupTitle={setPopupTitle} />
    );
};

export default HilltopSparkLineLayer;
