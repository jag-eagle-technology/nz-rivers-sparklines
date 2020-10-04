import React, { useEffect } from 'react';
import IMapView from 'esri/views/MapView';
import IGraphic from 'esri/Graphic';
import SparkLineLayer, { ISparkLineData } from './SparkLineLayer';
import {
    getHillTopSitesWithData,
} from '../api/HillTopAPI';
import { IMapToolTipLayer } from './MapToolTip';

export interface IHilltopSparkLineLayer {
    mapView?: IMapView;
    hilltopURL: string;
    measurement: string;
    wkid?: number;
    color: number[];
    setToolTipLayer?: (layer: IMapToolTipLayer) => void;
    // fixme 
    setData?: React.Dispatch<React.SetStateAction<ISparkLineData | undefined>>;
}

const HilltopSparkLineLayer = ({
    mapView,
    hilltopURL,
    measurement,
    wkid = 2193,
    color,
    setToolTipLayer,
    setData
}: IHilltopSparkLineLayer) => {
    const [sparkLineData, setSparkLineData] = React.useState<ISparkLineData>(
        []
    );
    useEffect(() => {
        setData && setData(sparkLineData);
    }, [setData, sparkLineData]);
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
    const getTitle = (graphic: IGraphic) => graphic.attributes.site;
    const getBody = (graphic: IGraphic) => graphic.attributes.site;
    return (
        <SparkLineLayer
            mapView={mapView}
            data={sparkLineData}
            color={color}
            setToolTipLayer={ setToolTipLayer && {setLayer: setToolTipLayer, getTitle, getBody}}
        />
    );
};

export default HilltopSparkLineLayer;
