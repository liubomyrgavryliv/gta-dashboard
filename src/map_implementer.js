import { geoNaturalEarth } from "d3-geo-projection";
import { MARGIN, WIDTH, HEIGHT } from './index.js';
import { area_chart } from './index.js';

export const map_implementer = function (){

    //append title to div
    d3.select('#div_implementer')
        .append('p')
        .html('Implementing jurisdiction')

    const SVG_MAP_IMPLEMENTER = d3.select("#div_implementer")
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
            .on('click', click)
            .on('mouseover', mouseover)
            .on('mouseout', mouseout)

        d3.select('#map_implementer g')
            .append('rect')
            .classed('maps_background', true)
            .attr("width", WIDTH/2 + MARGIN.left + MARGIN.right)
            .attr("height", HEIGHT + MARGIN.top + MARGIN.bottom)
            .on('click', () => { 
                d3.selectAll('.implementer_selected')
                    .classed('implementer_selected', false);
                    
                d3.selectAll('#map_implementer path')
                    .on('mouseover', mouseover)
                    .on('mouseout', mouseout);
             })
             .lower()
    })

}

function mouseover (d){
    d3.select(this)
        .classed('implementer_selected', true);
}

function mouseout (d){
    d3.select(this)
        .classed('implementer_selected', false);
}

function click (d){
    d3.selectAll('.implementer_selected')
        .classed('implementer_selected', false);

    d3.select(this)
        .classed('implementer_selected', true)
        .on('mouseout', null);

    d3.selectAll('#map_implementer g path')
        .on('mouseover', null)

    console.log(d);
    let affected = d3.select('.affected_selected').empty() ? null : d3.select('.affected_selected').datum().properties.name; // check if affected is selected
    area_chart(affected, d.properties.name);
}