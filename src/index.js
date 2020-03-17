import * as d3 from 'd3';
require("expose-loader?d3!d3"); // make d3 module available in the console


// here we are setting the canvas for the area chart
const MARGIN = {top: 10, right: 30, bottom: 30, left: 50},
    WIDTH = 1000 - MARGIN.left - MARGIN.right,
    HEIGHT = 400 - MARGIN.top - MARGIN.bottom;

// append the main and the svg objects to the page
d3.select('body')
        .append('div')
        .attr('id', 'main');

const SVG = d3.select("#main")
                            .append("svg")
                                .attr("width", WIDTH + MARGIN.left + MARGIN.right)
                                .attr("height", HEIGHT + MARGIN.top + MARGIN.bottom)
                                .append("g")
                                .attr("transform", `translate(${MARGIN.left},${MARGIN.top})`);

d3.csv('./data/data.csv',   //url
    function (d){           // row conversion function
        return {
            affected: d.affected,
            implementer: d.implementer,
            year: +d.year,  //convert to numbers
            flow: d.flow,
            value: +d.value //convert to numbers 
            }
        }).then(function(data) {
                    data = data.filter(d => d.affected == 'Canada') // modelling API request of Affected == Canada
                    data = data.filter(d => d.implementer == 'United States of America') // modelling API request of implementer == United States of America

                    console.log(data)

            // Add X axis
    const x = d3.scaleTime() // this is the scale for time domains
            .domain(d3.extent(data, d => new Date(+d.year,0) )) // the input data range 
            .range([ 0, WIDTH ]); // the ouput range, which the input data should fit

            SVG.append("g")
                .attr("transform", `translate(0,${HEIGHT})`) // axes are always rendered at the origin, that's why we need to transform them accordingly
                .call(d3.axisBottom(x));    // renders reference marks for scales
 
            // Add Y axis
    const y = d3.scaleLinear() // this is the quantitative scale
                .domain([0, d3.max(data, d => d.value )]) // the input data range from min to max
                .range([ HEIGHT, 0 ]); // the ouput range, which the input data should fit

            SVG.append("g")
                .call(d3.axisLeft(y)); // renders reference marks for scales

            // Add the area chart
            SVG.append("path")
                .datum(data) // binds data into an element
                .attr("fill", "#cce5df")
                .attr("stroke", "#69b3a2")
                .attr("stroke-width", 1.5)
                .attr("d", d3.area() //Constructs an area generator
                .x(d => x(new Date(+d.year,0)))
                .y0(y(0))   // sets bottom 'limit', eg zero
                .y1(d => y(d.value) )
                )
        });
