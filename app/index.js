
var d3 = require('d3');
require('./main.css');
var RationalBezierCurve = require('../lib/rational-bezier-curve');

var svg = d3.select('#example').append('svg')
  .attr({
    width: 400,
    height: 500
  });

var cx = 200;
var cy = 200;
var r = 100;
var circle = { cx: cx, cy: cy, r: r }
var circles = [circle];

var circleLayer = svg.append('g').attr('class', 'circle-layer');
var controlLayer = svg.append('g').attr('class', 'control-layer');
var curveLayer = svg.append('g').attr('class', 'curve-layer');

circleLayer.selectAll('circle.reference').data(circles)
  .enter().append('circle')
  .attr({
    'class': 'reference',
    cx: function(d) { return d.cx; },
    cy: function(d) { return d.cy; },
    r: function(d) { return d.r; }
  });

var n = 3;
var alpha = Math.PI / n;
var outerR = r / Math.cos(alpha);

var controlPoints = [];
function drawControlPoints() {
  for (var i = 0; i <= n; i++) {
    controlPoints.push({
      cx: cx + r * Math.sin(2 * i * alpha),
      cy: cy - r * Math.cos(2 * i * alpha),
      w: 1
    });
    controlPoints.push({
      cx: cx + outerR * Math.sin((2 * i + 1) * alpha),
      cy: cy - outerR * Math.cos((2 * i + 1) * alpha),
      w: 0.5 //Math.cos(alpha / 2)
    });
  }
  console.log('controlPoints', controlPoints);

  controlLayer.selectAll('circle.control').data(controlPoints)
    .enter().append('circle')
    .attr({
      'class': 'control',
      cx: function(d) { return d.cx; },
      cy: function(d) { return d.cy; },
      r: 4
    });
}
drawControlPoints();


function drawRationalBezierCurve() {
  var i, t;
  var n = 32;
  var curvePoints = [];
  var curve = new RationalBezierCurve(
    [controlPoints[0].cx, controlPoints[1].cx, controlPoints[2].cx],
    [controlPoints[0].cy, controlPoints[1].cy, controlPoints[2].cy],
    [controlPoints[0].w, controlPoints[1].w, controlPoints[2].w]
  );

  console.log(curve);

  for (i = 0; i <= n; i++) {
    t = i / n;
    curvePoints.push(curve.getPointAt(t));
  }
  console.log('curvePoints', curvePoints);
  curveLayer.selectAll('circle.curve').data(curvePoints)
    .enter().append('circle')
    .attr({
      'class': 'curve',
      cx: function(d) { return d.x; },
      cy: function(d) { return d.y; },
      r: 1
    });

  var lines = [];
  for (i = 0; i < n; i++) {
    lines.push({
      x1: curvePoints[i].x,
      y1: curvePoints[i].y,
      x2: curvePoints[i + 1].x,
      y2: curvePoints[i + 1].y
    });
  }
  curveLayer.selectAll('line.curve').data(lines)
    .enter().append('line')
    .attr({
      'class': 'curve',
      x1: function(d) { return d.x1; },
      y1: function(d) { return d.y1; },
      x2: function(d) { return d.x2; },
      y2: function(d) { return d.y2; }
    });
}
drawRationalBezierCurve();
