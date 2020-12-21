import React, { useRef, useEffect } from 'react';
import { select, json, geoOrthographic, geoPath } from 'd3';
import { feature } from 'topojson-client';
import useResizeObserver from '../services/ResizeSelector';
import PropTypes from 'prop-types';

function WorldMap({ data, property }) {
  const svgRef = useRef();
  const wrapperRef = useRef();
  const dimensions = useResizeObserver(wrapperRef);

  const svg = select(svgRef.current);
  const projection = geoOrthographic();
  const pathGenerator = geoPath().projection(projection);

  useEffect(() => {
    svg
      .selectAll('.country')
      .data(data.features)
      .join('path')
      .attr('class', 'country')
      .attr('d', feature => pathGenerator(feature));

  }, [data, dimensions, property]);

  json('https://unpkg.com/world-atlas@1/world/110m.json')
    .then(data => {
      const countries = feature(data, data.objects.countries);
      const paths = svg.selectAll('path')
        .data(countries.features);
      paths.enter().append('path')
        .attr('d', d => pathGenerator(d));
    });



  return (
    <div ref={wrapperRef} style={{ marginBottom: '2rem' }}>
      <svg ref={svgRef}></svg>
    </div>
  );
}

WorldMap.propTypes = {
  data: PropTypes.string,
  property: PropTypes.string
};

export default WorldMap;
