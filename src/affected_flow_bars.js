import { DIV_MAPS, MARGIN, WIDTH, HEIGHT } from './index.js';

export const AFFECTED_FLOW_BARS = function(data){

    console.log(data)

    let data_bars = PREPARE_DATA(data);
    console.log(data_bars)


const DIV_AFFECTED_FLOW = DIV_MAPS
        .append('div')
        .attr('id', 'div_affected_flow')
        .classed('column', true);

const SVG_AFFECTED_FLOW = DIV_AFFECTED_FLOW //set canvas for map
        .append("svg")
        .attr('id', 'svg_affected_flow')
        .attr("width", WIDTH/2 + MARGIN.left + MARGIN.right)
        .attr("height", HEIGHT + MARGIN.top + MARGIN.bottom);

const SVG_G = SVG_AFFECTED_FLOW
        .append("g")
        .attr("transform", `translate(${MARGIN.left},${MARGIN.top})`);

var x = d3.scaleBand()
        .rangeRound([0, WIDTH/4])
        .padding(0.1);

var y = d3.scaleLinear()
        .rangeRound([HEIGHT, 0]);


    x.domain(data_bars.map(d => d.flow));
        
	y.domain([0, d3.max(data_bars, function (d) {
				return Number(d.value);
            })]);
            
    SVG_G.append("g")
        .attr("transform", `translate(0,${HEIGHT})`)
        .call(d3.axisBottom(x));

    SVG_G.append("g")
        .call(d3.axisLeft(y))
        .append("text")
        .attr("fill", "#000")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", "0.71em")
        .attr("text-anchor", "end")
        .text("Percentage");

    SVG_G.selectAll(".bar")
        .data(data_bars)
        .enter().append("rect")
        .classed("affected_bars", true)
        .attr("x", d => x(d.flow))
        .attr("y", d => y(Number(d.value)))
        .attr("width", x.bandwidth())
        .attr("height", d => HEIGHT - y(Number(d.value)));
}


    

const PREPARE_DATA = function(initial){
    let data = initial.slice();
    let flows = data.map(d => d.flow).filter((el,ind,arr) => { return arr.indexOf(el) == ind });

    let output = [];
    for (let el of flows){
        let val = data.filter(d => d.flow == el).reduce((acc,el) => { return acc + el.value }, 0);
        output.push({flow: el, value: val})
    }
    return output;
}