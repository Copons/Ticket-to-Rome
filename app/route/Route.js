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

    this.boardContainer = board.svg;
    this.element = createSvg('line', {
      id: uuid.v4(),
      class: `route ${routeInfo.color}`,
      x1: stationStart.x,
      y1: stationStart.y,
      x2: stationEnd.x,
      y2: stationEnd.y,
      'stroke-width': SIZES.routeSize,
    });

    this.render();
  }

  render() {
    this.boardContainer.appendChild(this.element);
  }

}
