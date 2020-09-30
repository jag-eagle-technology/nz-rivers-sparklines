import xml2js from 'xml2js';
import { ISparkLineData } from '../components/SparkLineLayer';
// import GWRCHillTopSites from './GWRCHillTopSites.json';
// http://hilltop.gw.govt.nz/Data.hts?Service=Hilltop&Request=GetData&Site=Floodway%20at%20Oporua&Measurement=Stage&From=23/09/2020%2000:00:00&To=30/09/2020%2023:59:59&interval=undefined

export interface IgetHillTopMeasurements {
    site: string;
    measurement: string;
    // from: string;
    // to: string;
    // interval?: string;
}
export const getHillTopMeasurements = async ({
    site,
    measurement,
}: // from,
// to,
// interval = 'undefined',
IgetHillTopMeasurements) => {
    // Site=Floodway%20at%20Oporua
    // Measurement=Stage
    // From=23/09/2020%2000:00:00
    // To=30/09/2020%2023:59:59
    const siteMeasurementsXML = await fetch(
        // `http://hilltop.gw.govt.nz/Data.hts?Service=Hilltop&Request=GetData&Site=${site}&Measurement=${measurement}&From=${from}&To=${to}&interval=${interval}`
        `http://hilltop.gw.govt.nz/Data.hts?Service=Hilltop&Request=GetData&Site=${site}&Measurement=${measurement}&TimeInterval=P7D/now`
    ).then((response) => response.text());
    const xmlParser = await new xml2js.Parser({ explicitArray: false });
    const siteMeasurements = await xmlParser.parseStringPromise(
        siteMeasurementsXML
    );
    if (siteMeasurements.HilltopServer && siteMeasurements.HilltopServer.Error) {
        return;
    }
    // implement error catching here
    return siteMeasurements.Hilltop.Measurement.Data.E.map(
        (datum: { T: string; I1: string }) => [datum.T, +datum.I1]
    ) as [string, number][];
};

export const getHilltopDataForSites = async (
    sites: ISparkLineData
): Promise<ISparkLineData> => {
    const sitePromises = sites.map(async (site) => {
        const siteMeasurements = await getHillTopMeasurements({
            site: site.properties.site,
            measurement: site.properties.measurement,
        });
        site.data = siteMeasurements || [];
        return site;
    });
    return await Promise.all(sitePromises);
};

export const getHillTopSitesWithMeasurementType = async (
    measurement: string
) /*: Promise<ISparkLineData>*/ => {
    const sitesXML = await fetch(
        `http://hilltop.gw.govt.nz/Data.hts?Service=Hilltop&Request=SiteList&Location=Yes&Measurement=${measurement}`
    ).then((response) => response.text());
    const xmlParser = await new xml2js.Parser({ explicitArray: false });
    const siteMeasurements = await xmlParser.parseStringPromise(sitesXML);
    if (siteMeasurements.HilltopServer && siteMeasurements.HilltopServer.Error) {
        return;
    }
    // implement error catching here
    return siteMeasurements.HilltopServer.Site.map(
        (site: { $: { Name: string }; Easting: string; Northing: string }) => ({
            coordinates: { x: +site.Easting, y: +site.Northing },
            properties: { site: site.$.Name, measurement },
            data: [],
        })
    );
};
// export const hillTopSiteMeasurementsToData
