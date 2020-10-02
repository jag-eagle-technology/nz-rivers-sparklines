import React from 'react';
import d3 from 'd3';

type Props = {
    children: React.ReactNode;
};

const SVGContainer: React.FC<Props> = ({ children }: Props) => {
    const containerRef = React.useRef<HTMLDivElement>(null);
    return <div ref={containerRef} style={{position: 'relative', width: '100%', height: '100%'}} ></div>;
};

export default SVGContainer;
