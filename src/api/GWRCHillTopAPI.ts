import xml2js from 'xml2js';
import { ISparkLineData } from '../components/SparkLineLayer';
// import GWRCHillTopSites from './GWRCHillTopSites.json';
// http://hilltop.gw.govt.nz/Data.hts?Service=Hilltop&Request=GetData&Site=Floodway%20at%20Oporua&Measurement=Stage&From=23/09/2020%2000:00:00&To=30/09/2020%2023:59:59&interval=undefined

export interface IgetHillTopMeasurements {
    service?: string;
    site: string;
    measurement: string;
    // from: string;
    // to: string;
    // interval?: string;
}
export const getHillTopMeasurements = async ({
    service = 'Hilltop',
    site,
    measurement,
    // from,
    // to,
    // interval = 'undefined',
}: IgetHillTopMeasurements) => {
    // Site=Floodway%20at%20Oporua
    // Measurement=Stage
    // From=23/09/2020%2000:00:00
    // To=30/09/2020%2023:59:59
    const siteMeasurementsXML = await fetch(
        // `http://hilltop.gw.govt.nz/Data.hts?Service=${service}&Request=GetData&Site=${site}&Measurement=${measurement}&From=${from}&To=${to}&interval=${interval}`
        `http://hilltop.gw.govt.nz/Data.hts?Service=${service}&Request=GetData&Site=${site}&Measurement=${measurement}&TimeInterval=P7D/now`
    ).then((response) => response.text());
    const xmlParser = await new xml2js.Parser({ explicitArray: false });
    const siteMeasurements = await xmlParser.parseStringPromise(
        siteMeasurementsXML
    );
    console.log(siteMeasurements);
    return siteMeasurements.Hilltop.Measurement.Data.E.map(
        (datum: { T: string; I1: string }) => [datum.T, +datum.I1]
    ) as [string, number][];
};

export const getHilltopDataForSites = async (
    sites: ISparkLineData
): Promise<ISparkLineData> => {
    const sitePromises = sites.map(async (site) => {
        const siteMeasurements = await getHillTopMeasurements({
            service: site.properties.service,
            site: site.properties.site,
            measurement: site.properties.measurement,
        });
        site.data = siteMeasurements;
        return site;
    });
    return await Promise.all(sitePromises);
};
// export const hillTopSiteMeasurementsToData
