import { geoNaturalEarth } from "d3-geo-projection";
import { MARGIN, WIDTH, HEIGHT } from './index.js';
import { area_chart } from './index.js';

export const map_affected = function (){

const div_affected =  d3.select('#div_affected');

    //append title to div
    div_affected
        .append('h1')
        .text('Affected jurisdiction');

    //append name of selected affected country to div
    div_affected
        .append('p')
        .classed('title_affected', true);

        set_title(); //set initial title for country

    const SVG_MAP_AFFECTED = div_affected //set canvas for map
        .append("svg")
        .attr('id', 'map_affected')
        .attr("width", WIDTH/2 + MARGIN.left + MARGIN.right)
        .attr("height", HEIGHT + MARGIN.top + MARGIN.bottom);

    const PROJECTION = geoNaturalEarth() // a projection function that converts from a lon/lat point to an x/y point
        .scale(100) // scale a projection, eg zoom in/out. The default scale factor on a projection is 150, so a scale of 450 is three times zoomed in and so on
        .translate([WIDTH / 4, HEIGHT / 2]); // set the x/y value for the center (lon/lat) point of the map

    // Load external data and boot
    d3.json("https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson").then(function(data){
        // Draw the map
        SVG_MAP_AFFECTED.append("g")
            .selectAll("path")
            .data(data.features)
            .enter().append("path")
            .attr('fill', '#2F4F4F')
            .attr("d", d3.geoPath() // a function which converts GeoJSON data into SVG path
                            .projection(PROJECTION) // assigning it a projection function to calculate the position of each point on the path it creates
            )
            .style("stroke", "#fff");

    const MAP_AFFECTED_PATH =  d3.selectAll('#map_affected g');
        MAP_AFFECTED_PATH
            .selectAll('path')
            .on('click', click)
            .on('mouseover', mouseover)
            .on('mouseout', mouseout);

        MAP_AFFECTED_PATH
            .append('rect')
            .classed('maps_background', true)
            .attr("width", WIDTH/2 + MARGIN.left + MARGIN.right)
            .attr("height", HEIGHT + MARGIN.top + MARGIN.bottom)
            .on('click', () => { 
                d3.selectAll('.affected_selected')
                    .classed('affected_selected', false);
                    
                MAP_AFFECTED_PATH
                    .selectAll('path')
                    .on('mouseover', mouseover)
                    .on('mouseout', mouseout);

                set_title();
             })
             .lower()
    })

}

function mouseover (d){
    d3.select(this)
        .classed('affected_selected', true); //highlight path

        set_title(d.properties.name)  //show country name
}

function mouseout (d){
    d3.select(this)
        .classed('affected_selected', false); //remove highlight path

        set_title() //reset country name
}

function click (d){
    d3.selectAll('.affected_selected')
        .classed('affected_selected', false);

    set_title(d.properties.name) //show country name

    d3.select(this)
        .classed('affected_selected', true)
        .on('mouseout', null);

    d3.selectAll('#map_affected g path')
        .on('mouseout', null);

    d3.selectAll('#map_affected g path')
        .on('mouseover', null)

    console.log(d);
    let implementer = d3.select('.implementer_selected').empty() ? null : d3.select('.implementer_selected').datum().properties.name; // check if implementer is selected
    area_chart(d.properties.name, implementer);
}

const set_title = function (set = 'Please, choose country...'){ //reset country title
    d3.select('.title_affected')
        .text(set) 
}