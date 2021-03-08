import React from 'react';
import { scoreToColor } from '../hooks/hooks';

const DrawFlowers = ({ flowerData, useD3 }) => {

  //Size controls
  let height = '1000px';
  let width = '1000px';
  let petalSize = 75;

  let ref = useD3(SVG => {
    const flowers = SVG
      .selectAll('g')
      .data(flowerData)
      .enter()
      .append('g')
      .attr('transform', (d, i) => `translate(${(i % 10) * petalSize * 2 + petalSize},${Math.floor(i / 10) * petalSize * 2 + petalSize})`)

    //outer circle
    flowers
      .append('circle')
      .attr('id', 'outer')
      .attr('cx', 0)
      .attr('cy', 0)
      .attr('r', petalSize)
      .style('fill', '#c4c2c4');

    //inner circle color determined by SPI score.
    flowers
      .append('circle')
      .attr('cx', 0)
      .attr('cy', 0)
      .attr('r', d => petalSize * d.spiScale)
      .style('fill', d => { return scoreToColor(d.spi) })

    //each individual petal
    flowers.selectAll('path')
      .data(d => d.petals)
      .enter()
      .append('path')
      .attr('d', d => d.petalPath)
      .attr('transform', d => `rotate(${d.angle}) scale(${d.petSize})`)
      .style('stroke', 'black')
      .style('fill', d => { return scoreToColor(d.colorRef) })

    // Add a rectangle to display name/numerics
    flowers
      .append('rect')
      .attr("width", petalSize * 2)
      .attr("height", petalSize * .25)
      .attr('transform', `translate(-${(petalSize)},-${petalSize})`)
      .style('fill', 'white')

    //name
    flowers
      .append('text')
      .attr('class', 'name')
      .attr('transform', (d, i) => `translate(-${(petalSize)},-${petalSize * .75})`)
      .text(d => { return d.name });

    //add score to inner circle
    flowers
      .append('text')
      .attr('class', 'score')
      .attr('transform', `translate(0,-${petalSize}) scale(${petalSize / 100})`)
      // .attr('transform', (d,i) => `scale(${petalSize / 100})`) 
      .text(d => { return d.spi });

    flowers.exit().remove()
    
    return SVG;

  }, [flowerData, useD3]);

  return <svg ref={ref} id="my-svg" height={height} width={width} ></svg>;
};

export default DrawFlowers;