import './route.css';

import uuid from 'node-uuid';
import { createSvg } from '../utils/dom';
import { listen } from '../utils/events';
import { STATIONS } from '../constants/railway';
import { SIZES } from '../constants/layout';
import RoutePopup from './RoutePopup';


/** Class representing a route. */
export default class Route {


  /**
   * Create the route.
   * @param  {Object} route - The route information.
   * @param  {Board} board - The game board.
   */
  constructor(route, board) {
    this.id = uuid.v4();
    this.type = route.color;
    this.parts = route.parts;
    this.claimed = false;
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
      id: this.id,
      class: `route unclaimed ${this.type}`,
    });

    this.mouseEnterRoute = this.mouseEnterRoute.bind(this);
    this.mouseLeaveRoute = this.mouseLeaveRoute.bind(this);
  }


  /**
   * Append the route to the game board.
   */
  render() {
    this.stations.elements = [
      this.boardContainer.stations.querySelector(`[data-station="${this.stations.start.slug}"]`),
      this.boardContainer.stations.querySelector(`[data-station="${this.stations.end.slug}"]`),
      this.boardContainer.names.querySelector(`[data-station="${this.stations.start.slug}"]`),
      this.boardContainer.names.querySelector(`[data-station="${this.stations.end.slug}"]`),
    ];
    listen(this.element, 'mouseenter', this.mouseEnterRoute);
    listen(this.element, 'mouseleave', this.mouseLeaveRoute);
    this.boardContainer.routes.appendChild(this.element);
    this.popup = new RoutePopup(this);
  }


  /**
   * Calculate the route stroke-dasharray attribute.
   * @param  {number} lineLength - The route length.
   * @return {string}
   */
  pathDashArray(lineLength) {
    const stationOffset = SIZES.stationRadius;
    const pathLength = lineLength - stationOffset * 2 - (this.parts - 1) * SIZES.routeGap;

    const dashes = [0, stationOffset];
    for (let i = 0; i < this.parts; i++) {
      dashes.push(pathLength / this.parts);
      if (i !== this.parts - 1) {
        dashes.push(SIZES.routeGap);
      }
    }
    dashes.push(stationOffset);

    return dashes.join(', ');
  }


  /**
   * Add the attributes to the route element.
   */
  setPathAttributes() {
    this.element.setAttributeNS(null, 'd', this.pathD());
    this.element.setAttributeNS(null,
      'stroke-dasharray', this.pathDashArray(this.pathLength()));
  }


  /**
   * Highlight the route stations when the mouse hovers on the route.
   */
  mouseEnterRoute() {
    for (const element of this.stations.elements) {
      element.classList.add('highlight');
    }
  }


  /**
   * Stop highlighting the route stations when the mouse leaves the route.
   */
  mouseLeaveRoute() {
    for (const element of this.stations.elements) {
      element.classList.remove('highlight');
    }
  }

}
