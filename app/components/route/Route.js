import './route.css';
import uuid from 'node-uuid';
import { STATIONS } from '../config';
import { createSvg } from '../../libs/dom';


/** Class representing a route. */
export default class Route {

  /**
   * Create the route.
   * @param {Object}  route          The route information.
   * @param {Element} boardContainer The board element.
   */
  constructor(route, boardContainer) {
    this.id = uuid.v4();
    this.type = route.type;
    this.parts = route.parts;
    this.stations = this.setupStations(route, boardContainer);
    this.element = this.setupElement();
  }


  setupStations(route, boardContainer) {
    const stations = {
      start: STATIONS.find(station => station.slug === route.start),
      end: STATIONS.find(station => station.slug === route.end),
      elements: boardContainer.querySelectorAll(
        `[data-station="${route.start}"], [data-station="${route.end}"]`
      ),
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
    return createSvg('path', {
      id: this.id,
      class: `route unclaimed ${this.type}`,
    });
  }

}
