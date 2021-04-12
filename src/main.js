import * as d3 from 'd3';
import { scaleBand } from 'd3';


const width = 500;
const usableWidth = width; // Math.min(500, width);
const height = usableWidth / 50 * 94;

const margins = 20;
const pi = Math.PI / 180;

function x(v) {
    return d3.scaleLinear().range([0, usableWidth - margins * 2]).domain([-25, 25])(v);
};
function y(v) {
    return d3.scaleLinear().range([0, height - margins * 2]).domain([0, 94])(v);
}

const basket = y(4);
const basketRadius = y(4.75) - basket;
const threeAngle = Math.atan((10 - 0.75) / 22) * 180 / Math.PI;

function arc(radius, start, end) {

    const points = [...Array(30)].map((d, i) => i);

    const angle = d3.scaleLinear()
        .domain([0, points.length - 1])
        .range([start, end]);

    const line = d3.lineRadial()
        .radius(radius)
        .angle((d, i) => angle(i));

    return line(points);
}

function color(c) {
    return d3.scaleSequential(d3.interpolateOrRd).domain([0, 1])(c);
}

function set_all_box_color(g, intensity_2D) {
    for (var a = -25; a < 25; a += S) {
        for (var b = 0; b < 94; b += S) {
            // console.log(d3.select('box-' + a + '-' + b))
            g.select('#box-' + a + '-' + b).style('fill', color(intensity_2D[(a + 25) / 2][b / 2])).style('fill-opacity', '0.5')
        }
    }
}

function draw_rectangle(i, j, dst, g, mouseover, mousemove, mouseleave) {
    var dst_2D = dst[(25 + i) / 2][j / 2]
    g.append('rect')
        .style('stroke', 'none')
        .style('fill-opacity', '0.5')
        .style('transition', '0.4s')
        .attr('id', 'box-' + i + '-' + j)
        .attr('x', y(j))
        .attr('y', x(i))
        .attr('rx', 4)
        .attr('ry', 4)
        .attr('width', y(j + S) - y(j))
        .attr('height', x(i + S) - x(i))
        .on('click', function () {
            // console.log('CLICKED');
            // console.log(dst_2D)
            set_all_box_color(g, dst_2D)
            g.select('#box-' + i + '-' + j).style('fill', 'black').style('fill-opacity', '1.0')
        })
        .on('mouseover', mouseover)
        .on('mousemove', mousemove)
        .on('mouseleave', mouseleave)
}

function stubbed_dst_data() {
    return Array.from(Array(50), () => Array.from(Array(94), () => Array.from(Array(50), () => Array.from(Array(94), Math.random))));
}

function stubbed_src_data() {
    return Array.from(Array(50), () => Array.from(Array(94), Math.random));
}

// data must be wrapped into an async function, and it returns a Promise
async function _src_data(d3) {
    return d3
        .json(
            'https://raw.githubusercontent.com/6859-sp21/a4-bball-passing-chart/data_processing/src/src.txt'
        )
}

// data must be wrapped into an async function, and it returns a Promise
async function _dst_data(d3) {
    return d3
        .json(
            'https://raw.githubusercontent.com/6859-sp21/a4-bball-passing-chart/data_processing/src/dst.txt'
        )
}

async function _load_chart_data(d3) {
    return d3.csv("https://raw.githubusercontent.com/holtzy/data_to_viz/master/Example_dataset/7_OneCatOneNum_header.csv");
}

const S = 2
// const src = stubbed_src_data()
// const dst = stubbed_dst_data()


function _chart(d3, width, height, src, dst, chart_data) {
    const svg = d3
        .select('#joyplot')
        .append('svg')
        .attr('width', height)
        .attr('height', width)
        .attr('viewBox', `0,0,${height},${width}`);

    const g = svg.append('g')
        .attr('transform', `translate(${[margins, margins]})`)
        .style('fill', 'none')
        .style('stroke', '#000')

    // baskets
    g.append('circle')
        .attr('r', basketRadius)
        .attr('cx', y(4.75))
        .attr('cy', x(0))

    g.append('circle')
        .attr('r', basketRadius)
        .attr('cx', y(94 - 4.75))
        .attr('cy', x(0))

    // backboards
    g.append('rect')
        .attr('x', y(4))
        .attr('y', x(-3))
        .attr('width', 1)
        .attr('height', x(3) - x(-3))

    g.append('rect')
        .attr('x', y(94 - 4))
        .attr('y', x(-3))
        .attr('width', 1)
        .attr('height', x(3) - x(-3))

    // outer paint
    g.append('rect')
        .attr('x', y(0))
        .attr('y', x(-8))
        .attr('width', y(15) + y(4))
        .attr('height', x(8) - x(-8))

    g.append('rect')
        .attr('x', y(94) - y(15) - y(4))
        .attr('y', x(-8))
        .attr('width', y(15) + y(4))
        .attr('height', x(8) - x(-8))

    // inner paint
    g.append('rect')
        .attr('x', y(0))
        .attr('y', x(-6))
        .attr('width', y(15) + y(4))
        .attr('height', x(6) - x(-6))

    g.append('rect')
        .attr('x', y(94) - y(15) - y(4))
        .attr('y', x(-6))
        .attr('width', y(15) + y(4))
        .attr('height', x(6) - x(-6))

    // restricted area
    g.append('path')
        .attr('d', arc(y(4) - y(0), 0, 180 * pi))
        .attr('transform', `translate(${[basket, x(0)]})`)

    g.append('path')
        .attr('d', arc(x(4) - x(0), -180 * pi, 0 * pi))
        .attr('transform', `translate(${[y(94) - basket, x(0)]})`)

    // freethrow
    g.append('path')
        .attr('d', arc(x(6) - x(0), 0 * pi, 180 * pi))
        .attr('transform', `translate(${[y(15) + basket, x(0)]})`)

    g.append('path')
        .attr('d', arc(x(6) - x(0), -180 * pi, 0 * pi))
        .attr('transform', `translate(${[y(94) - y(15) - basket, x(0)]})`)

    // freethrow dotted
    g.append('path')
        .attr('d', arc(x(6) - x(0), -180 * pi, 0 * pi))
        .attr('stroke-dasharray', '3,3')
        .attr('transform', `translate(${[y(15) + basket, x(0)]})`)

    g.append('path')
        .attr('d', arc(x(6) - x(0), 0, 180 * pi))
        .attr('stroke-dasharray', '3,3')
        .attr('transform', `translate(${[y(94) - y(15) - basket, x(0)]})`)

    // 3-point lines
    g.append('line')
        .attr('y1', x(-21.775)) // lines up the stroke a little better than the true 22 ft.
        .attr('x2', y(14))
        .attr('y2', x(-21.775))

    g.append('line')
        .attr('y1', x(21.775))
        .attr('x2', y(14))
        .attr('y2', x(21.775))

    g.append('line')
        // lines up the stroke a little better than the true 22 ft.
        .attr('x1', y(94))
        .attr('y1', x(-21.775))
        .attr('x2', y(94) - y(14))
        .attr('y2', x(-21.775))

    g.append('line')
        .attr('y1', x(21.775))
        .attr('x2', y(94) - y(14))
        .attr('y2', x(21.775))
        .attr('x1', y(94))

    // 3-point arc
    g.append('path')
        .attr('d', arc(y(22.75), (threeAngle) * pi, (180 - threeAngle) * pi))
        .attr('transform', `translate(${[basket + basketRadius, x(0)]})`)

    g.append('path')
        .attr('d', arc(y(22.75), (threeAngle + 180) * pi, (360 - threeAngle) * pi))
        .attr('transform', `translate(${[y(94) - basket - basketRadius, x(0)]})`)

    // half court outer
    g.append('path')
        .attr('d', arc(x(6) - x(0), -90 * pi, 90 * pi))
        .attr('transform', `translate(${[y(47), x(0)]})`)

    g.append('path')
        .attr('d', arc(x(6) - x(0), 90 * pi, 270 * pi))
        .attr('transform', `translate(${[y(47), x(0)]})`)

    // half court inner
    g.append('path')
        .attr('d', arc(x(2) - x(0), -90 * pi, 90 * pi))
        .attr('transform', `translate(${[y(47), x(0)]})`)

    g.append('path')
        .attr('d', arc(x(2) - x(0), 90 * pi, 270 * pi))
        .attr('transform', `translate(${[y(47), x(0)]})`)

    // half court line
    g.append('line')
        .attr('y1', x(-25))
        .attr('y2', x(25))
        .attr('x1', y(47))
        .attr('x2', y(47))

    // boundaries
    g.append('rect')
        .style('stroke', '#ddd')
        .attr('y', x(-25))
        .attr('x', y(0))
        .attr('height', x(25))
        .attr('width', y(94))

    // create a tooltip
    var Tooltip = d3.select("#joyplot")
        .append("div")
        .style("opacity", 0)
        .style('position', 'absolute')
        .attr("class", "tooltip")
        .style("background-color", "white")
        .style("border", "solid")
        .style("border-width", "2px")
        .style("border-radius", "5px")
        .style("padding", "5px")

    // Three function that change the tooltip when user hover / move / leave a cell
    var mouseover = function (d) {
        Tooltip
            .style("opacity", 1)
        d3.select(this)
            .style("stroke", "black")
            .style("opacity", 1)
    }
    var mousemove = function (d) {
        Tooltip
            .html("The exact value of<br>this cell is: TBD")
            .style("left", (d3.mouse(this)[0]) + "px")
            .style("top", (d3.mouse(this)[1]) + "px")
    }
    var mouseleave = function (d) {
        Tooltip
            .style("opacity", 0)
        d3.select(this)
            .style("stroke", "none")
            .style("opacity", 0.8)
    }

    for (var a = -25; a < 25; a += S) {
        for (var b = 0; b < 94; b += S) {
            draw_rectangle(a, b, dst, g, mouseover, mousemove, mouseleave);
        }
    }
    // console.log('GOT HERE!');
    // console.log(src);

    set_all_box_color(g, src)
    // console.log('AND HERE!');
    draw_bar_chart(svg, g, chart_data)

    return svg.node();
}

function draw_bar_chart(svg, g, data) {
    // Add X axis
    var chart_margin = { top: 20, right: 30, bottom: 40, left: 90 },
        chart_width = 460 - chart_margin.left - chart_margin.right,
        chart_height = 400 - chart_margin.top - chart_margin.bottom;

    // append the svg object to the body of the page
    var svg = d3.select("#joyplot")
        .append("svg")
        .attr("width", height + chart_margin.left + chart_margin.right)
        .attr("height", width + chart_margin.top + chart_margin.bottom)
        .append("g")
        .attr("transform",
            "translate(" + chart_margin.left + "," + chart_margin.top + ")");

    var chart_label = (v) => {
        return '<img src="https://secure.espn.com/combiner/i?img=/i/teamlogos/nba/500/bkn.png&amp;w=56&amp;h=56" width="28" height="28" alt="BKN"> ' + v;
    }

    // Add X axis
    var x = d3.scaleLinear()
        .domain([0, 13000])
        .range([0, height]);
    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x))
        .selectAll("text")
        .attr("transform", "translate(-10,0)rotate(-45)")
        .style("text-anchor", "end");

    // Y axis
    var y = d3.scaleBand()
        .range([0, width])
        .domain(data.map(function (d) { return d.Country; }))
        .padding(.1);
    svg.append("g")
        .call(d3.axisLeft(y))

    //Bars
    svg.selectAll("myRect")
        .data(data)
        .enter()
        .append("rect")
        .attr("x", x(0))
        .attr("y", function (d) { return y(d.Country); })
        .attr("width", function (d) { return x(d.Value); })
        .attr("height", y.bandwidth())
        .attr("fill", "#69b3a2")
}

function _reset_button(src) {
    const svg = d3
        .select('#reset_button')
        .append('svg')
        .attr('width', 100)
        .attr('height', 100)
        .attr('viewBox', `0,0,100,100`);

    const button = svg.append('rect')
        .attr('transform', `translate(${[margins, margins]})`)
        .attr('width', 100)
        .attr('height', 100)
        .style('fill', 'brown')
        .style('stroke', '#add8e6')
        .on('click', function () {
            set_all_box_color(d3, src);
        });

}



// Data flow
async function main(d3, width) {
    // height = 1000;
    const src = await _src_data(d3);
    console.log(src)
    const dst = await _dst_data(d3);
    console.log(dst);
    const chart_data = await _load_chart_data(d3);
    const chart = _chart(d3, width, height, src, dst, chart_data);
    const reset_button = _reset_button(src);
}

main(d3, width);

// document.querySelector('#joyplot').innerHTML =
//     'Placeholder for the joyplot chart.';