import { geoNaturalEarth } from "d3-geo-projection";
import { MARGIN, WIDTH, HEIGHT } from './index.js';
import { area_chart } from './index.js';

export function map_implementer(){

    const SVG_MAP_IMPLEMENTER = d3.select("#div_maps")
    .append("svg")
        .attr('id', 'map_implementer')
        .attr("width", WIDTH/2 + MARGIN.left + MARGIN.right)
        .attr("height", HEIGHT + MARGIN.top + MARGIN.bottom);

        

    const PROJECTION = geoNaturalEarth()
        .scale(WIDTH / 3 / Math.PI)
        .translate([WIDTH / 4, HEIGHT / 2])

    // Load external data and boot
    d3.json("https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson").then(function(data){
        // Draw the map
        SVG_MAP_IMPLEMENTER.append("g")
            .selectAll("path")
            .data(data.features)
            .enter().append("path")
            .attr("fill", "#9370DB")
            .attr("d", d3.geoPath().projection(PROJECTION))
            .style("stroke", "#fff");

        d3.selectAll('#map_implementer path')
            .on('click', d => console.log(d))
            .on('mouseover', mouseover)
            .on('mouseout', mouseout)
    })

}

function mouseover (d){
    d3.select(this).attr('fill', '#8B0000')
}

function mouseout (d){
    d3.select(this).attr('fill', '#9370DB')
}
