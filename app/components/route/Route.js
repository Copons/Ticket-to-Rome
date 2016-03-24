import './route.css';
import uuid from 'node-uuid';
import { SIZES, STATIONS } from '../../config';
import { createSvg } from '../../libs/dom';
import { listen } from '../../libs/events';


/** Class representing a route. */
export default class Route {

  /**
   * Create the route.
   * @param {Object} route The route information.
   * @param {Board}  board The game board.
   */
  constructor(route, board) {
    this.id = uuid.v4();
    this.type = route.type;
    this.parts = route.parts;
    this.stations = this.setupStations(route, board);
    this.element = this.setupElement();
  }


  /**
   * [setupStations description]
   * @param  {Object} route The route information.
   * @param  {Board}  board The game board.
   * @return {Object}
   */
  setupStations(route, board) {
    const stations = {
      start: Object.assign({},
        STATIONS.find(station => station.slug === route.start)
      ),
      end: Object.assign({},
        STATIONS.find(station => station.slug === route.end)
      ),
      elements: board.railway.stations
        .filter(station =>
          station.slug === route.start || station.slug === route.end
        ).map(station => station.element),
    };
    if (route.displace) {
      stations.start.x += route.displace.x1;
      stations.start.y += route.displace.y1;
      stations.end.x += route.displace.x2;
      stations.end.y += route.displace.y2;
    }
    return stations;
  }


  /**
   * Create the route element.
   * @return {Element}
   */
  setupElement() {
    const element = createSvg('path', {
      id: this.id,
      class: `route unclaimed ${this.type}`,
    });
    listen(element, 'mouseenter', this.mouseEnter);
    listen(element, 'mouseleave', this.mouseLeave);
    return element;
  }


  /**
   * Calculate the route stroke-dasharray attribute.
   * @param  {number} lineLength The route length.
   * @return {string}
   */
  pathDashArray(lineLength) {
    const stationOffset = SIZES.station.radius;
    const pathLength = lineLength - stationOffset * 2 - (this.parts - 1) * SIZES.route.gap;
    const dashes = [0, stationOffset];
    for (let i = 0; i < this.parts; i++) {
      dashes.push(pathLength / this.parts);
      if (i !== this.parts - 1) {
        dashes.push(SIZES.route.gap);
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
      'stroke-dasharray', this.pathDashArray(this.pathLength())
    );
  }


  /**
   * Highlight the route stations when the mouse enter the route.
   */
  mouseEnter = () => {
    for (const element of this.stations.elements) {
      element.station.classList.add('highlight');
      element.name.classList.add('highlight');
    }
  }


  /**
   * Stop highlighting the route stations when the mouse leaves the route.
   */
  mouseLeave = () => {
    for (const element of this.stations.elements) {
      element.station.classList.remove('highlight');
      element.name.classList.remove('highlight');
    }
  }

}
