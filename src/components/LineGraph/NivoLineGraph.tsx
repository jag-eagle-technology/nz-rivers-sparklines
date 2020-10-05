import React from 'react';
import { ResponsiveLine } from '@nivo/line';

// fixme - type
const NivoLineGraphs: React.FC<{ data: any }> = ({ data }) => {
    // xScale is date
    const textColor = '#c5c9c9';
    const lineColor = '#5a5c5c';
    return (
        <ResponsiveLine
            margin={{ top: 20, right: 20, bottom: 20, left: 80 }}
            data={data}
            animate={true}
            curve={'monotoneX'}
            colors={'rgb(45, 143, 255)'}
            theme={{
                axis: {
                    ticks: {
                        text: {
                            fill: textColor,
                        },
                        line: {
                            stroke: lineColor,
                        },
                    },
                    legend: {
                        text: {
                            fill: textColor,
                        },
                    },
                    domain: {
                        line: {
                            stroke: lineColor,
                        },
                    },
                },
                grid: {
                    line: {
                        stroke: lineColor,
                    },
                },
                legends: {
                    text: {
                        fill: textColor,
                    },
                },
                labels: {
                    text: {
                        fill: textColor,
                    },
                },
                crosshair: {
                    line: {
                        stroke: 'white',
                    },
                },
                tooltip: {
                    basic: {
                        zIndex: 9999
                    },
                    container: {
                        zIndex: 9999
                    }
                }
            }}
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
            lineWidth={3}
            useMesh={true}
            enableSlices={false}
        />
    );
};

export default NivoLineGraphs;
