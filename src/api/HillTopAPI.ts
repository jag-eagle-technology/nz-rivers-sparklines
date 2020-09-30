import xml2js from 'xml2js';
import { ISparkLineData } from '../components/SparkLineLayer';
// http://hilltop.gw.govt.nz/Data.hts?Service=Hilltop&Request=GetData&Site=Floodway%20at%20Oporua&Measurement=Stage&From=23/09/2020%2000:00:00&To=30/09/2020%2023:59:59&interval=undefined

export interface IgetHillTopMeasurements {
    hilltopURL: string;
    site: string;
    measurement: string;
    // from: string;
    // to: string;
    // interval?: string;
}
export const getHillTopMeasurements = async ({
    hilltopURL, // http://hilltop.gw.govt.nz/Data.hts
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
        `${hilltopURL}?Service=Hilltop&Request=GetData&Site=${site}&Measurement=${measurement}&TimeInterval=P7D/now`
    ).then((response) => response.text());
    const xmlParser = await new xml2js.Parser({ explicitArray: false });
    const siteMeasurements = await xmlParser.parseStringPromise(
        siteMeasurementsXML
    );
    if (
        !siteMeasurements ||
        !siteMeasurements.Hilltop ||
        (siteMeasurements.HilltopServer && siteMeasurements.HilltopServer.Error)
    ) {
        console.log('bad: ');
        console.log(siteMeasurements);
        return;
    }
    // implement error catching here
    return siteMeasurements.Hilltop.Measurement.Data.E.map(
        (datum: { T: string; I1: string }) => [datum.T, +datum.I1]
    ) as [string, number][];
};

export const getHilltopDataForSites = async ({
    hilltopURL,
    sites,
}: {
    hilltopURL: string;
    sites: ISparkLineData;
}): Promise<ISparkLineData> => {
    const sitePromises = sites.map(async (site) => {
        const siteMeasurements = await getHillTopMeasurements({
            hilltopURL,
            site: site.properties.site,
            measurement: site.properties.measurement,
        });
        site.data = siteMeasurements || [];
        return site;
    });
    return await Promise.all(sitePromises);
};

export const getHillTopSites = async ({
    hilltopURL,
    measurement,
}: {
    hilltopURL: string;
    measurement: string;
}): Promise<ISparkLineData> => {
    const sitesXML = await fetch(
        `${hilltopURL}?Service=Hilltop&Request=SiteList&Location=Yes&Measurement=${measurement}`
    ).then((response) => response.text());
    const xmlParser = await new xml2js.Parser({ explicitArray: false });
    const siteMeasurements = await xmlParser.parseStringPromise(sitesXML);
    if (
        !siteMeasurements ||
        !siteMeasurements.HilltopServer ||
        !!siteMeasurements.HilltopServer.Error
    ) {
        console.log('bad: ');
        console.log(siteMeasurements);
        return [];
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

export const getHillTopSitesWithData = async ({
    hilltopURL,
    measurement,
}: {
    hilltopURL: string;
    measurement: string;
}): Promise<ISparkLineData> => {
    const sites = await getHillTopSites({
        hilltopURL,
        measurement,
    });
    const hillTopMeasurements = await getHilltopDataForSites({
        hilltopURL,
        sites,
    });
    return hillTopMeasurements;
};
