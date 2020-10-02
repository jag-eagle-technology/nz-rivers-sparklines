import React from 'react';
import d3 from 'd3';

type Props = {
    children: React.ReactNode;
};

const SVGContainer: React.FC<Props> = ({ children }: Props) => {
    const containerRef = React.useRef<HTMLDivElement>(null);
    var margin = { top: 10, right: 30, bottom: 30, left: 60 },
        width = 460 - margin.left - margin.right,
        height = 400 - margin.top - margin.bottom;
    const init = () => {
        if (!containerRef.current) {
            return;
        }
        const svgWidth = containerRef.current.offsetWidth;
        const svgHeight = containerRef.current.offsetHeight;
        const margin = { top: 10, right: 30, bottom: 30, left: 60 };
        const graphWidth = svgWidth - margin.right - margin.left;
        const graphHeight = svgHeight - margin.top - margin.bottom;
        d3.select(containerRef.current).append('svg');
    };
    return (
        <div
            ref={containerRef}
            style={{ position: 'relative', width: '100%', height: '100%' }}
        ></div>
    );
};

export default SVGContainer;
