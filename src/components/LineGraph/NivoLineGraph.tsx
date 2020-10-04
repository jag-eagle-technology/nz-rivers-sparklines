import React from 'react';
import { ResponsiveLine } from '@nivo/line';

// fixme - type
const NivoLineGraphs: React.FC<{ data: any }> = ({ data }) => {
    // xScale is date
    return (
        <ResponsiveLine
            margin={{ top: 20, right: 20, bottom: 60, left: 80 }}
            data={data}
            animate={true}
            curve={'monotoneX'}
            colors={'rgb(45, 143, 255)'}
            enablePoints={false}
            xScale={{
                type: 'time',
                format: '%Y-%m-%dT%H:%M:%S',
                useUTC: false,
                precision: 'second',
            }}
            xFormat={'time:%Y-%m-%dT%H:%M:%S'}
            yScale={{
                type: 'linear',
                stacked: false,
            }}
            axisLeft={{
                legend: 'Flow Rate (m³/s)',
                legendOffset: -30,
            }}
            axisBottom={{
                format: '%b %d %H:%M',
                tickValues: 'every 6 hours',
            }}
            useMesh={true}
            enableSlices={false}
        />
    );
};

export default NivoLineGraphs;
