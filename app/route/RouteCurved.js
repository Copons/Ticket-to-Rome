import Route from './Route';

export default class RouteCurved extends Route {

  constructor(route, board) {
    super(route, board);

    this.bezier = {
      p0: { x: this.stations.start.x, y: this.stations.start.y },
      p1: { x: route.qx, y: route.qy },
      p2: { x: this.stations.end.x, y: this.stations.end.y },
    };

    this.setPathAttributes(route.parts);

    this.render();
  }

  pathD() {
    const d = [
      'M', this.bezier.p0.x, this.bezier.p0.y,
      'Q', this.bezier.p1.x, this.bezier.p1.y,
      this.bezier.p2.x, this.bezier.p2.y,
    ];
    return d.join(' ');
  }

  pathLength() {
    const a = {
      x: this.bezier.p0.x - 2 * this.bezier.p1.x + this.bezier.p2.x,
      y: this.bezier.p0.y - 2 * this.bezier.p1.y + this.bezier.p2.y,
    };
    const b = {
      x: 2 * this.bezier.p1.x - 2 * this.bezier.p0.x,
      y: 2 * this.bezier.p1.y - 2 * this.bezier.p0.y,
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

}
