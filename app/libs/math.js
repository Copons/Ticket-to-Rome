/**
 * Calculate a random integer.
 * @param  {number} limit The maximum random number.
 * @return {number}
 */
export function random (limit) {
  return Math.floor(Math.random() * limit);
}


/**
 * Calculate the length of a quadratic bezier curve.
 * @param  {Object} p0 The coordinates of the first point.
 * @param  {Object} p1 The coordinates of the second point.
 * @param  {Object} p2 The coordinates of the third point.
 * @return {number}
 */
export function bezierLength (p0, p1, p2) {
  const a = {
    x: p0.x - 2 * p1.x + p2.x,
    y: p0.y - 2 * p1.y + p2.y,
  };
  const b = {
    x: 2 * p1.x - 2 * p0.x,
    y: 2 * p1.y - 2 * p0.y,
  };

  const A = 4 * (a.x * a.x + a.y * a.y);
  const B = 4 * (a.x * b.x + a.y * b.y);
  const C = b.x * b.x + b.y * b.y;

  const SABC = 2 * Math.sqrt(A + B + C);
  const A2 = Math.sqrt(A);
  const A32 = 2 * A * A2;
  const C2 = 2 * Math.sqrt(C);
  const BA = B / A2;

  return (
    A32 * SABC + A2 * B * (SABC - C2) +
    (4 * C * A - B * B) *
    Math.log((2 * A2 + BA + SABC) / (BA + C2))
  ) / (4 * A32);
}


/**
 * Calculate the length of a straight line.
 * @param  {Object} p0 The coordinates of the first point.
 * @param  {Object} p1 The coordinates of the second point.
 * @return {number}
 */
export function lineLength(p0, p1) {
  return Math.sqrt(Math.pow(p1.x - p0.x, 2) + Math.pow(p1.y - p0.y, 2));
}
