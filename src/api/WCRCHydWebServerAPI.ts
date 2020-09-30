export const getPointValues = async (pointId: number) => {
    console.log('url is');
    console.log(
        `https://data.wcrc.govt.nz/cgi-bin/hydwebserver.cgi/points/samples?point=${pointId}`
    );
    const pointValues = await fetch(
        `https://data.wcrc.govt.nz/cgi-bin/hydwebserver.cgi/points/samples?point=${pointId}`,
        { mode: 'no-cors' }
    ).then((results) => results.text());
    // const results = await pointValues.text();
    console.log(pointValues);
    // console.log(pointValues.text());
    return pointValues;
};
