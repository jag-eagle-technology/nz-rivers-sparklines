import xml2js from 'xml2js';
import { ISparkLineData } from '../components/SparkLineLayer';
// http://hilltop.gw.govt.nz/Data.hts?Service=Hilltop&Request=GetData&Site=Floodway%20at%20Oporua&Measurement=Stage&From=23/09/2020%2000:00:00&To=30/09/2020%2023:59:59&interval=undefined

export interface IhilltopGetDataQuery {
    site: string;
    measurement: string;
    timeInterval?: string;
    range?: {
        from: string;
        to: string;
    }
}

export interface IhilltopGetDataQueryResults {
    
}

// ${hilltopURL}?Service=Hilltop&Request=SiteList&Location=Yes&Measurement=${measurement}
export interface IhilltopSiteListQuery {
    location: 'Yes' | 'LatLng';
    measurement: boolean;
}



export interface IhilltopQuery {
    hilltopURL: string;
    getData?: IhilltopGetDataQuery;
    getSiteList?: IhilltopSiteListQuery;
}

export interface IhilltopQueryError {
    HilltopServer: {
        Error: any
    }
}

// *** current api *** //
export interface IgetHillTopMeasurements {
    hilltopURL: string;
    site: string;
    measurement: string;
    range?: {
        from: string;
        to: string;
    }
    interval?: string;
}
export const getHillTopMeasurements = async ({
    hilltopURL,
    site,
    measurement,
    range,
    interval
}: // from,
// to,
// interval = 'undefined',
IgetHillTopMeasurements) => {
    // Site=Floodway%20at%20Oporua
    // Measurement=Stage
    // From=23/09/2020%2000:00:00
    // To=30/09/2020%2023:59:59
    // const queryString = `${hilltopURL}`;
    const siteMeasurementsXML = await fetch(
        `${hilltopURL}?Service=Hilltop&Request=GetData&Site=${site}&Measurement=${measurement}&TimeInterval=P7D/now`, {cache: 'no-store'}
    ).then((response) => response.text());
    const xmlParser = await new xml2js.Parser({ explicitArray: false });
    const siteMeasurements = await xmlParser.parseStringPromise(
        siteMeasurementsXML
    );
    if (
        !siteMeasurements ||
        !siteMeasurements.Hilltop ||
        !siteMeasurements.Hilltop.Measurement ||
        !siteMeasurements.Hilltop.Measurement.Data ||
        !siteMeasurements.Hilltop.Measurement.Data.E ||
        (siteMeasurements.HilltopServer && siteMeasurements.HilltopServer.Error)
    ) {
        // console.log('bad: ');
        // console.log(siteMeasurements);
        return;
    }
    // implement error catching here
    // console.log(siteMeasurements);
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
        `${hilltopURL}?Service=Hilltop&Request=SiteList&Location=Yes&Measurement=${measurement}`, {cache: 'no-store'}
    ).then((response) => response.text());
    const xmlParser = await new xml2js.Parser({ explicitArray: false });
    const siteMeasurements = await xmlParser.parseStringPromise(sitesXML);
    if (
        !siteMeasurements ||
        !siteMeasurements.HilltopServer ||
        !!siteMeasurements.HilltopServer.Error
    ) {
        // console.log('bad: ');
        // console.log(siteMeasurements);
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

// DataTable based api
// http://hilltop.gw.govt.nz/Data.hts?Service=Hilltop&Request=DataTable&Site=Mangatarere River at State Highway 2,Mangatarere at Belvedere Bridge&Measurement=Flow&From=24/09/2020&To=01/10/2020&SiteParameters=Location
interface datatableResults {
    HilltopServer: {
        Measurements: {
            ColumnName: string;
            Mesurement: string;
            Units: string;
        };
        Results: { M1: string; SiteName: string; Time: string }[];
        $: any;
        'xsd:schema': any;
    };
}
export const getHilltopDataForSitesWithDatatable = async ({
    hilltopURL,
    measurement,
}: {
    hilltopURL: string;
    measurement: string;
}) => {
    const sites = await getHillTopSites({ hilltopURL, measurement });
    const chunk = (array: any[], size: number): any[] => {
        if (array.length <= size) {
            return [array];
        }
        return [array.slice(0, size), ...chunk(array.slice(size), size)];
    };
    const mapSiteNamesToObjectPropreties = (acc: any, result: any) => {
        return {
            ...acc,
            [result.SiteName]: [
                ...(acc[result.SiteName] || []),
                [result.Time, result.M1],
            ],
        };
    };
    /*
    const resultPromises = siteChunks(sites, 10).map(async sites => {
        const sitesString = sites.reduce((prev: string, cur:any) => prev + `"${cur.properties.site}",`, '');
        const urlToFetch = `${hilltopURL}?Service=Hilltop&Request=DataTable&Measurement=${measurement}&TimeInterval=P7D/now&From=24/09/2020&To=01/10/2020&Site=${sitesString}`;
        const siteMeasurementsXML = await fetch(
            urlToFetch
        ).then((response) => response.text());
        const xmlParser = await new xml2js.Parser({ explicitArray: false });
        const siteMeasurements: datatableResults = await xmlParser.parseStringPromise(
            siteMeasurementsXML
        );
    });
    */
    const siteChunks = chunk(sites, 10);
    const resultPromises = await siteChunks.reduce(async (acc, sites) => {
        const sitesString = sites.reduce(
            (prev: string, cur: any) => prev + `"${cur.properties.site}",`,
            ''
        );
        const urlToFetch = `${hilltopURL}?Service=Hilltop&Request=DataTable&Measurement=${measurement}&TimeInterval=P7D/now&From=24/09/2020&To=01/10/2020&Site=${sitesString}`;
        const siteMeasurementsXML = await fetch(urlToFetch, {cache: 'no-store'}).then((response) =>
            response.text()
        );
        const xmlParser = await new xml2js.Parser({ explicitArray: false });
        const siteMeasurements: datatableResults = await xmlParser.parseStringPromise(
            siteMeasurementsXML
        );
        // console.log(siteMeasurements);
        const chunkSiteObjects = siteMeasurements.HilltopServer.Results.reduce(
            mapSiteNamesToObjectPropreties,
            <{ [key: string]: any[] }>{}
        );
        // console.log(chunkSiteObjects);
        if (!siteMeasurements.HilltopServer.Results) {
            // console.log(siteMeasurements);
            // console.log(urlToFetch);
            return { ...acc };
        }
        return { ...acc, ...chunkSiteObjects };
    }, {});
    console.log(resultPromises);
};
