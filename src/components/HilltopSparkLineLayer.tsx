import React, { useEffect } from 'react';
import IMapView from 'esri/views/MapView';
import IGraphic from 'esri/Graphic';
import IGraphicsLayer from 'esri/layers/GraphicsLayer';
import SparkLineLayer, { ISparkLineData } from './SparkLineLayer';
import { getHillTopSitesWithData } from '../api/HillTopAPI';
import { getToolTipInfo } from '../components/MapToolTip';

export interface IHilltopSparkLineLayer {
    mapView?: IMapView;
    hilltopURL: string;
    measurement: string;
    wkid?: number;
    color: number[];
    // fixme
    setLayer?: React.Dispatch<React.SetStateAction<IGraphicsLayer | undefined>>;
    setData?: React.Dispatch<React.SetStateAction<ISparkLineData | undefined>>;
    setGetToolTipDetails?: React.Dispatch<
        React.SetStateAction<getToolTipInfo | undefined>
    >;
}

const HilltopSparkLineLayer = ({
    mapView,
    hilltopURL,
    measurement,
    wkid = 2193,
    color,
    setLayer,
    setData,
    setGetToolTipDetails,
}: IHilltopSparkLineLayer) => {
    const [sparkLineData, setSparkLineData] = React.useState<ISparkLineData>(
        []
    );
    const [hilltopLayer, setHilltopLayer] = React.useState<IGraphicsLayer>();
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
        setGetToolTipDetails && setGetToolTipDetails({ getTitle, getBody });
        // setLayer && setLayer(hilltopLayer);
        // console.log(hilltopLayer);
    };
    useEffect(() => setLayer && setLayer(hilltopLayer));
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
            setLayer={setHilltopLayer}
        />
    );
};

export default HilltopSparkLineLayer;
