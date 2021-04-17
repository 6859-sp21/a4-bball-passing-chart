import * as d3 from 'd3';
import { scaleBand } from 'd3';

const width = 500;
const usableWidth = width; // Math.min(500, width);
const height = usableWidth / 50 * 94;

var chart_margin = { top: 40, right: 30, bottom: 40, left: 90 },
    chart_width = 940 - chart_margin.left - chart_margin.right,
    chart_height = 500 - chart_margin.top - chart_margin.bottom;

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

function set_all_box_color(g, intensity_2D, mouseover_vals) {

    var mouseover = function (d) {
        d3.select('#tooltip')
            .style("opacity", 1)
        d3.select(this)
            .style("stroke", "black")
            .style("opacity", 1)
    }
    var mousemove = function (d) {
        var id = d3.select(this).attr('id').substring(4);
        var split_id = id.split('-');
        var a1 = parseInt(split_id[0]);
        var b1 = parseInt(split_id[1]);
        // console.log(d3.select(this).attr('id'));
        // console.log(id);
        var coordinates = d3.mouse(this);
        console.log(coordinates);
        console.log(d3.event.pageX)
        // console.log(a1 / 2);
        // console.log(b1 / 2);

        d3.select('#tooltip')
            .html("Passes from basketball to here: " + mouseover_vals[a1 / 2][b1 / 2])
            .style("left", (d3.event.pageX + 20) + "px")
            .style("top", (d3.event.pageY + 20) + "px")
    }
    var mouseleave = function (d) {
        d3.select('#tooltip')
            .style("opacity", 0)
        d3.select(this)
            .style("stroke", "none")
            .style("opacity", 0.8)
    }

    for (var a = -25; a < 25; a += S) {
        for (var b = 0; b < 94; b += S) {
            // console.log(d3.select('box-' + a + '-' + b))
            g.select('#box-' + (a + 25) + '-' + b)
                .style('fill', color(intensity_2D[(a + 25) / 2][b / 2]))
                .style('fill-opacity', '0.5')
                .on('mouseover', mouseover)
                .on('mousemove', mousemove)
                .on('mouseleave', mouseleave)
        }
    }
}

function draw_rectangle(i, j, dst, g, dst_mouseover, chart_data) {
    // Three function that change the tooltip when user hover / move / leave a cell
    var dst_2D = dst[(25 + i) / 2][j / 2]
    var dst_mouseover_2D = dst_mouseover[(25 + i) / 2][j / 2]
    var chart_data_2D = chart_data[(25 + i) / 2][j / 2]
    g.append('rect')
        .style('stroke', 'none')
        .style('fill-opacity', '0.5')
        .style('transition', '0.4s')
        .attr('id', 'box-' + (i + 25) + '-' + j)
        .attr('x', y(j))
        .attr('y', x(i))
        .attr('rx', 4)
        .attr('ry', 4)
        .attr('width', y(j + S) - y(j))
        .attr('height', x(i + S) - x(i))
        .on('click', function () {
            // console.log('CLICKED');
            // console.log(dst_2D)
            set_all_box_color(g, dst_2D, dst_mouseover_2D)
            g.select('#box-' + (i + 25) + '-' + j).style('fill', 'black').style('fill-opacity', '1.0')
            draw_bar_chart(g, chart_data_2D);
        })
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

async function _src_raw_data(d3) {
    return d3
        .json(
            'https://raw.githubusercontent.com/6859-sp21/a4-bball-passing-chart/data_processing/src/src_raw.txt'
        )
}

// data must be wrapped into an async function, and it returns a Promise
async function _dst_data(d3) {
    return d3
        .json(
            'https://raw.githubusercontent.com/6859-sp21/a4-bball-passing-chart/data_processing/src/dst.txt'
        )
}

async function _dst_raw_data(d3) {
    return d3
        .json(
            'https://raw.githubusercontent.com/6859-sp21/a4-bball-passing-chart/data_processing/src/dst_raw.txt'
        )
}

async function _load_chart_data(d3) {
    return d3.json("https://raw.githubusercontent.com/6859-sp21/a4-bball-passing-chart/data_processing/src/shot_pct_cleaned.json");
}

const S = 2
// const src = stubbed_src_data()
// const dst = stubbed_dst_data()


function _chart(d3, width, height, src, dst, src_raw, dst_raw, chart_data) {
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
        .attr('id', 'tooltip')
        .style("opacity", 0)
        .style('position', 'absolute')
        .attr("class", "tooltip")
        .style("background-color", "white")
        .style("border", "solid")
        .style("border-width", "2px")
        .style("border-radius", "5px")
        .style("padding", "5px")


    for (var a = -25; a < 25; a += S) {
        for (var b = 0; b < 94; b += S) {
            draw_rectangle(a, b, dst, g, dst_raw, chart_data);
        }
    }
    // console.log('GOT HERE!');
    // console.log(src);

    set_all_box_color(g, src, src_raw)
    // console.log('AND HERE!');

    d3.select("#joyplot")
        .append("svg")
        .attr("width", height + chart_margin.left + chart_margin.right)
        .attr("height", width + chart_margin.top + chart_margin.bottom)
        .append("g")
        .attr("transform",
            "translate(" + chart_margin.left + "," + chart_margin.top + ")")
        .attr('id', 'bar-chart');

    return svg.node();
}

function draw_bar_chart(g, data) {
    // Add X axis
    d3.select('#bar-chart').selectAll('*').remove();
    var svg = d3.select('#bar-chart');
    // console.log(svg);

    var x = d3.scaleBand()
        .range([0, chart_width])
        .domain(data.map(function (d) {
            return d.name;
        }))
        .padding(0.2);
    svg.append("g")
        .attr("transform", "translate(0," + chart_height + ")")
        .call(d3.axisBottom(x))
        .selectAll("text")
        .attr("transform", "translate(-10,0)rotate(-45)")
        .style("text-anchor", "end");

    // Add Y axis
    var y = d3.scaleLinear()
        .domain([0, 1])
        .range([chart_height, 0]);
    svg.append("g")
        .call(d3.axisLeft(y));

    // console.log(svg)
    // Bars
    svg.selectAll("mybar")
        .data(data)
        .enter()
        .append("rect")
        .attr('id', 'team-bars')
        .attr('class', function (d) {
            return d.name;
        })
        .attr("x", function (d) {
            return x(d.name);
        })
        .attr("y", function (d) {
            return y(d.val);
        })
        .attr("width", x.bandwidth())
        .attr("height", function (d) {
            // console.log(d.val);
            // console.log(y(d.val));
            return chart_height - y(0); // always equal to 0
        })
        .attr("fill", "#983275")
        .on('mouseover', function (d, i) {
            d3.select('#bar-chart')
                .append("text")
                .attr("class", "bar")
                .attr("text-anchor", "middle")
                .attr("x", x(d.name) + ((chart_width / data.length) / 2)
                )
                .attr("y", y(d.val) - 5)
                .attr('id', 'bar-label')
                .text((d.val * 100).toFixed(0) + '%');
            d3.select(this)
                .attr('fill', '#811d5e');
        })
        .on('mouseleave', function (d, i) {
            d3.select('#bar-label').remove();
            d3.select(this)
                .attr('fill', '#983275');
        });

    // Animation
    svg.selectAll("#team-bars")
        .transition()
        .duration(400)
        .attr("y", function (d) { return y(d.val); })
        .attr("height", function (d) { return chart_height - y(d.val); })
        .delay(function (d, i) { console.log(i); return (i * 100) })

    // svg.selectAll("text.mybar")
    //     .data(data)
    //     .enter().append("text")
    //     .attr("class", "bar")
    //     .attr("text-anchor", "middle")
    //     .attr("x", function (d) {
    //         return x(d.name) + ((chart_width / data.length) / 2);
    //     })
    //     .attr("y", function (d) {
    //         return y(d.val) - 5;
    //     })
    //     .text(function (d) { return (d.val * 100).toFixed(0) + '%'; });

    d3.select('#bar-chart')
        .append('text')
        .attr("x", (chart_width / 2))
        .attr("y", -10)
        .attr("text-anchor", "middle")
        .attr('font-weight', 600)
        .text("The Shot Percentage From Your Chosen Location");

    d3.select('#bar-chart')
        .append('text')
        .attr("x", (chart_width / 2))
        .attr("y", chart_height + 110)
        .attr("text-anchor", "middle")
        .text("NBA Teams (Who Shot From That Location)");

    d3.select('#bar-chart')
        .append('text')
        .attr("x", -(chart_width / 4))
        .attr("y", -40)
        .attr("text-anchor", "middle")
        .attr("transform", "rotate(-90)")
        .text("Shot Percentage");
}

function _reset_button(src) {
    // const svg = d3
    //     .select('#reset_button')
    //     .append('svg')
    //     .attr('width', 100)
    //     .attr('height', 100)
    //     .attr('viewBox', `0,0,100,100`);
    const button = d3.select('#reset-button')
        .attr('transform', `translate(${[margins, margins]})`)
        .attr('width', 100)
        .attr('height', 100)
        .style('fill', 'brown')
        .style('stroke', '#add8e6')
        .on('click', function () {
            set_all_box_color(d3, src);
            d3.select('#bar-chart').selectAll('*').remove();
        });

}



// Data flow
async function main(d3, width) {
    // height = 1000;
    const src = await _src_data(d3);
    const dst = await _dst_data(d3);
    const src_raw = await _src_raw_data(d3);
    const dst_raw = await _dst_raw_data(d3);
    // console.log(src);
    // console.log(dst);
    // console.log(src_raw);
    // console.log(dst_raw);
    const chart_data = await _load_chart_data(d3);
    console.log(chart_data);
    const chart = _chart(d3, width, height, src, dst, src_raw, dst_raw, chart_data);
    const reset_button = _reset_button(src);
}

main(d3, width);

// document.querySelector('#joyplot').innerHTML =
//     'Placeholder for the joyplot chart.';