import * as d3 from 'd3';
import { scaleBand } from 'd3';


const width = 960;
const usableWidth = Math.min(500, width);
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
            g.select('#box-' + a + '-' + b).style('fill', color(intensity_2D[(a + 25) / 2][b / 2]))
        }
    }
}

function draw_rectangle(i, j, dst, g) {

    var dst_2D = dst[(25 + i) / 2][j / 2]
    g.append('rect')
        .style('stroke', 'none')
        .style('fill-opacity', '0.5')
        .attr('id', 'box-' + i + '-' + j)
        .attr('x', x(i))
        .attr('y', y(j))
        .attr('width', x(i + S) - x(i))
        .attr('height', y(j + S) - y(j))
        .on('click', function () {
            // console.log('CLICKED');
            // console.log(dst_2D)
            set_all_box_color(g, dst_2D)
            g.select('#box-' + i + '-' + j).style('fill', 'black')
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

// data must be wrapped into an async function, and it returns a Promise
async function _dst_data(d3) {
    return d3
        .json(
            'https://raw.githubusercontent.com/6859-sp21/a4-bball-passing-chart/data_processing/src/dst.txt'
        )
}

const S = 2
// const src = stubbed_src_data()
// const dst = stubbed_dst_data()


function _chart(d3, width, height, src, dst) {
    const svg = d3
        .select('#joyplot')
        .append('svg')
        .attr('width', width)
        .attr('height', height)
        .attr('viewBox', `0,0,${width},${height}`);

    const g = svg.append('g')
        .attr('transform', `translate(${[margins, margins]})`)
        .style('fill', 'none')
        .style('stroke', '#000');

    // baskets
    g.append('circle')
        .attr('r', basketRadius)
        .attr('cx', x(0))
        .attr('cy', y(4.75));

    g.append('circle')
        .attr('r', basketRadius)
        .attr('cx', x(0))
        .attr('cy', y(94 - 4.75));

    // backboards
    g.append('rect')
        .attr('x', x(-3))
        .attr('y', y(4))
        .attr('width', x(3) - x(-3))
        .attr('height', 1);

    g.append('rect')
        .attr('x', x(-3))
        .attr('y', y(94 - 4))
        .attr('width', x(3) - x(-3))
        .attr('height', 1);

    // outer paint
    g.append('rect')
        .attr('x', x(-8))
        .attr('y', y(0))
        .attr('width', x(8) - x(-8))
        .attr('height', y(15) + y(4));

    g.append('rect')
        .attr('x', x(-8))
        .attr('y', y(94) - y(15) - y(4))
        .attr('width', x(8) - x(-8))
        .attr('height', y(15) + y(4))

    // inner paint
    g.append('rect')
        .attr('x', x(-6))
        .attr('y', y(0))
        .attr('width', x(6) - x(-6))
        .attr('height', y(15) + y(4))

    g.append('rect')
        .attr('x', x(-6))
        .attr('y', y(94) - y(15) - y(4))
        .attr('width', x(6) - x(-6))
        .attr('height', y(15) + y(4))

    // restricted area
    g.append('path')
        .attr('d', arc(x(4) - x(0), 90 * pi, 270 * pi))
        .attr('transform', `translate(${[x(0), basket]})`)

    g.append('path')
        .attr('d', arc(x(4) - x(0), -90 * pi, 90 * pi))
        .attr('transform', `translate(${[x(0), y(94) - basket]})`)

    // freethrow
    g.append('path')
        .attr('d', arc(x(6) - x(0), 90 * pi, 270 * pi))
        .attr('transform', `translate(${[x(0), y(15) + basket]})`)

    g.append('path')
        .attr('d', arc(x(6) - x(0), -90 * pi, 90 * pi))
        .attr('transform', `translate(${[x(0), y(94) - y(15) - basket]})`)

    // freethrow dotted
    g.append('path')
        .attr('d', arc(x(6) - x(0), -90 * pi, 90 * pi))
        .attr('stroke-dasharray', '3,3')
        .attr('transform', `translate(${[x(0), y(15) + basket]})`)

    g.append('path')
        .attr('d', arc(x(6) - x(0), 90 * pi, 270 * pi))
        .attr('stroke-dasharray', '3,3')
        .attr('transform', `translate(${[x(0), y(94) - y(15) - basket]})`)

    // 3-point lines
    g.append('line')
        .attr('x1', x(-21.775)) // lines up the stroke a little better than the true 22 ft.
        .attr('x2', x(-21.775))
        .attr('y2', y(14))

    g.append('line')
        .attr('x1', x(21.775))
        .attr('x2', x(21.775))
        .attr('y2', y(14))

    g.append('line')
        .attr('x1', x(-21.775)) // lines up the stroke a little better than the true 22 ft.
        .attr('y1', y(94))
        .attr('x2', x(-21.775))
        .attr('y2', y(94) - y(14))

    g.append('line')
        .attr('x1', x(21.775))
        .attr('y2', y(94) - y(14))
        .attr('x2', x(21.775))
        .attr('y1', y(94))

    // 3-point arc
    g.append('path')
        .attr('d', arc(y(23.75), (threeAngle + 90) * pi, (270 - threeAngle) * pi))
        .attr('transform', `translate(${[x(0), basket + basketRadius]})`)

    g.append('path')
        .attr('d', arc(y(23.75), (threeAngle - 90) * pi, (90 - threeAngle) * pi))
        .attr('transform', `translate(${[x(0), y(94) - basket - basketRadius]})`)

    // half court outer
    g.append('path')
        .attr('d', arc(x(6) - x(0), -90 * pi, 90 * pi))
        .attr('transform', `translate(${[x(0), y(47)]})`)

    g.append('path')
        .attr('d', arc(x(6) - x(0), 90 * pi, 270 * pi))
        .attr('transform', `translate(${[x(0), y(47)]})`)

    // half court inner
    g.append('path')
        .attr('d', arc(x(2) - x(0), -90 * pi, 90 * pi))
        .attr('transform', `translate(${[x(0), y(47)]})`)

    g.append('path')
        .attr('d', arc(x(2) - x(0), 90 * pi, 270 * pi))
        .attr('transform', `translate(${[x(0), y(47)]})`)

    // half court line
    g.append('line')
        .attr('x1', x(-25))
        .attr('x2', x(25))
        .attr('y1', y(47))
        .attr('y2', y(47))

    // boundaries
    g.append('rect')
        .style('stroke', '#ddd')
        .attr('x', x(-25))
        .attr('y', y(0))
        .attr('width', x(25))
        .attr('height', y(94))

    for (var a = -25; a < 25; a += S) {
        for (var b = 0; b < 94; b += S) {
            draw_rectangle(a, b, dst, g);
        }
    }
    // console.log('GOT HERE!');
    // console.log(src);

    set_all_box_color(g, src)
    // console.log('AND HERE!');

    return svg.node();
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
    const chart = _chart(d3, width, height, src, dst);
    const reset_button = _reset_button(src);
}

main(d3, width);

// document.querySelector('#joyplot').innerHTML =
//     'Placeholder for the joyplot chart.';