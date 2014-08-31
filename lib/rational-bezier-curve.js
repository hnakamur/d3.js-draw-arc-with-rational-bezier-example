function RationalBezierCurve(xs, ys, ws) {
  this.xs = xs;
  this.ys = ys;
  this.ws = ws;
}

RationalBezierCurve.fromPointsAndWeights = function (points, weights) {
  return new RationalBezierCurve(
    points.map(function(point) { return point.x; }),
    points.map(function(point) { return point.y; }),
    weights
  );
}

function getBernsteinRationalPolynomialValueAt(w, b, t) {
  // See cagd.pdf 3.2 Horner's Algorithm in Bernstein Basis
  var n = b.length - 1;
  var u = 1 - t;
  var bc = 1;
  var tn = 1;
  var numerator = w[0] * b[0] * u;
  var denominator = w[0] * u;
  var i = 1;
  for (; i < n; i++) {
    tn *= t;
    bc *= (n - i + 1) / i;
    numerator = (numerator + tn * w[i] * bc * b[i]) * u;
    denominator = (denominator + tn * w[i] * bc) * u;
  }
  numerator += tn * t * w[n] * b[n];
  denominator += tn * t * w[n];
  return numerator / denominator;
}

RationalBezierCurve.prototype.getPointAt = function(t) {
  return {
    x: getBernsteinRationalPolynomialValueAt(this.ws, this.xs, t),
    y: getBernsteinRationalPolynomialValueAt(this.ws, this.ys, t)
  };
};

module.exports = RationalBezierCurve;
