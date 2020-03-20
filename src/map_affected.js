import { geoNaturalEarth } from "d3-geo-projection";
import { MARGIN, WIDTH, HEIGHT } from './index.js';
import { area_chart } from './index.js';

export function map_affected(){

    //append title to div
    d3.select('#div_affected')
        .append('p')
        .html('Affected jurisdiction')

    const SVG_MAP_AFFECTED = d3.select("#div_affected")
        .append("svg")
        .attr('id', 'map_affected')
        .attr("width", WIDTH/2 + MARGIN.left + MARGIN.right)
        .attr("height", HEIGHT + MARGIN.top + MARGIN.bottom);

    const PROJECTION = geoNaturalEarth()
        .scale(WIDTH / 3 / Math.PI)
        .translate([WIDTH / 4, HEIGHT / 2])

    // Load external data and boot
    d3.json("https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson").then(function(data){
        // Draw the map
        SVG_MAP_AFFECTED.append("g")
            .selectAll("path")
            .data(data.features)
            .enter().append("path")
            .attr('fill', '#2F4F4F')
            .attr("d", d3.geoPath().projection(PROJECTION))
            .style("stroke", "#fff");

        d3.selectAll('#map_affected path')
            .on('click', click)
            .on('mouseover', mouseover)
            .on('mouseout', mouseout);

        d3.select('#map_affected g')
            .append('rect')
            .classed('maps_background', true)
            .attr("width", WIDTH/2 + MARGIN.left + MARGIN.right)
            .attr("height", HEIGHT + MARGIN.top + MARGIN.bottom)
            .on('click', () => { 
                d3.selectAll('.affected_selected')
                    .classed('affected_selected', false);
                    
                d3.selectAll('#map_affected path')
                    .on('mouseover', mouseover)
                    .on('mouseout', mouseout);
             })
             .lower()
    })

}

function mouseover (d){
    d3.select(this)
        .classed('affected_selected', true);
}

function mouseout (d){
    d3.select(this)
        .classed('affected_selected', false);
}

function click (d){
    d3.selectAll('.affected_selected')
        .classed('affected_selected', false);

    d3.select(this)
        .classed('affected_selected', true)
        .on('mouseout', null);

    d3.selectAll('#map_affected g path')
        .on('mouseover', null)

    console.log(d);
    let implementer = d3.select('.implementer_selected').empty() ? null : d3.select('.implementer_selected').datum().properties.name; // check if implementer is selected
    area_chart(d.properties.name, implementer);
}