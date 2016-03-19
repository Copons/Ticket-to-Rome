import './route.css';

import uuid from 'node-uuid';
import { createSvg } from '../utils/dom';
import { SIZES } from '../constants/layout';
import { STATIONS, ROUTES } from '../constants/railway';

export default class Route {

  constructor(start, end, board) {
    const routeInfo = ROUTES.find(route => route.start === start && route.end === end);
    const stationStart = STATIONS.find(station => station.slug === start);
    const stationEnd = STATIONS.find(station => station.slug === end);

    this.bezier = {
      p0: { x: stationStart.x, y: stationStart.y },
      p1: { x: routeInfo.qx, y: routeInfo.qy },
      p2: { x: stationEnd.x, y: stationEnd.y },
    };

    this.boardContainer = board.svg;
    this.element = createSvg('path', {
      id: uuid.v4(),
      class: `route ${routeInfo.color}`,
      d: this.pathD(),
      'stroke-dasharray': this.pathDashArray(routeInfo.parts),
    });

    this.render();
  }

  render() {
    this.boardContainer.appendChild(this.element);
  }

  pathD() {
    const d = [
      'M', this.bezier.p0.x, this.bezier.p0.y,
      'Q', this.bezier.p1.x, this.bezier.p1.y,
      this.bezier.p2.x, this.bezier.p2.y,
    ];
    return d.join(' ');
  }

  pathDashArray(parts) {
    const stationOffset = SIZES.stationRadius;
    const pathLength = this.quadraticBezierLength() -
      stationOffset * 2 -
      (parts - 1) * SIZES.routeGap;

    const dashes = [0, stationOffset];
    for (let i = 0; i < parts; i++) {
      dashes.push(pathLength / parts);
      if (i !== parts - 1) {
        dashes.push(SIZES.routeGap);
      }
    }
    dashes.push(stationOffset);

    return dashes.join(', ');
  }

  quadraticBezierLength() {
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
