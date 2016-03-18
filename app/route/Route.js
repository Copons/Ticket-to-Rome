import './route.css';

import uuid from 'node-uuid';
import { create, setStyle } from '../utils/dom';
//import { SIZES } from '../constants/layout';
import { STATIONS, ROUTES } from '../constants/railway';

export default class Route {

  constructor(start, end, board) {
    const routeInfo = ROUTES.find(route => route.start === start && route.end === end);
    const stationStart = STATIONS.find(station => station.slug === start);
    const stationEnd = STATIONS.find(station => station.slug === end);

    this.size = routeInfo.size;
    this.coordinates = {
      x1: stationStart.x,
      y1: stationStart.y,
      x2: stationEnd.x,
      y2: stationEnd.y,
    };

    this.boardContainer = board.element;
    this.element = create('div', 'path', {
      id: uuid.v4(),
      style: `top: ${this.coordinates.y1}%; left: ${this.coordinates.x1}%;`,
    });
    setStyle(this.element, {
      top: `${this.coordinates.y1}%`,
      left: `${this.coordinates.x1}%`,
    });
    this.element.classList.add(routeInfo.color);
    this.render();
  }

  render() {
    this.boardContainer.appendChild(this.element);
  }

}
