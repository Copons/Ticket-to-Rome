import './route.css';

import uuid from 'node-uuid';
import { createSvg } from '../utils/dom';
import { listen } from '../utils/events';
import { sessionGet } from '../utils/storage';
import { STATIONS } from '../constants/railway';
import { SIZES } from '../constants/layout';

export default class Route {

  constructor(route, board) {
    this.stations = {
      start: Object.assign({}, STATIONS.find(station => station.slug === route.start)),
      end: Object.assign({}, STATIONS.find(station => station.slug === route.end)),
      elements: [],
    };

    if (route.displace) {
      this.stations.start.x += route.displace.x1;
      this.stations.end.x += route.displace.x2;
      this.stations.start.y += route.displace.y1;
      this.stations.end.y += route.displace.y2;
    }

    this.boardContainer = board.elements;
    this.element = createSvg('path', {
      id: uuid.v4(),
      class: `route ${route.color}`,
    });

    this.mouseEnterRoute = this.mouseEnterRoute.bind(this);
    this.mouseLeaveRoute = this.mouseLeaveRoute.bind(this);
    this.dragEnterRoute = this.dragEnterRoute.bind(this);
    this.dragLeaveRoute = this.dragLeaveRoute.bind(this);
  }

  render() {
    this.stations.elements = [
      this.boardContainer.stations.querySelector(`[data-station="${this.stations.start.slug}"]`),
      this.boardContainer.stations.querySelector(`[data-station="${this.stations.end.slug}"]`),
      this.boardContainer.names.querySelector(`[data-station="${this.stations.start.slug}"]`),
      this.boardContainer.names.querySelector(`[data-station="${this.stations.end.slug}"]`),
    ];
    listen(this.element, 'mouseenter', this.mouseEnterRoute);
    listen(this.element, 'mouseleave', this.mouseLeaveRoute);
    listen(this.element, 'dragenter', this.dragEnterRoute);
    listen(this.element, 'dragleave', this.dragLeaveRoute);
    this.boardContainer.routes.appendChild(this.element);
  }

  pathDashArray(lineLength, parts) {
    const stationOffset = SIZES.stationRadius;
    const pathLength = lineLength - stationOffset * 2 - (parts - 1) * SIZES.routeGap;

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

  setPathAttributes(parts) {
    this.element.setAttributeNS(null, 'd', this.pathD());
    this.element.setAttributeNS(null,
      'stroke-dasharray', this.pathDashArray(this.pathLength(), parts));
  }

  mouseEnterRoute() {
    for (const element of this.stations.elements) {
      element.classList.add('highlight');
    }
  }

  mouseLeaveRoute() {
    for (const element of this.stations.elements) {
      element.classList.remove('highlight');
    }
  }

  dragEnterRoute() {
    console.log(sessionGet('dragStartGroup'));
    this.mouseEnterRoute();
  }

  dragLeaveRoute() {
    this.mouseLeaveRoute();
  }

}
