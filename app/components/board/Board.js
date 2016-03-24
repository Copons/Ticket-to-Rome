import './board.css';
import { APP_CONTAINER, SIZES, STATIONS, ROUTES } from '../../config';
import { create, createSvg } from '../../libs/dom';
import RouteStraight from '../route/RouteStraight';
import RouteCurved from '../route/RouteCurved';
import Station from '../station';


/** Class representing the game board. */
export default class Board {


  /**
   * Create the game board.
   */
  constructor() {
    this.element = this.setupElement();
    this.railway = {};
    this.railway.stations = this.setupRailwayStations();
    this.railway.routes = this.setupRailwayRoutes();
    this.render();
  }


  /**
   * Setup the railway stations.
   * @return {Object}
   */
  setupRailwayStations() {
    return STATIONS.map(station => new Station(station));
  }


  /**
   * Setup the railway routes.
   * @return {Object}
   */
  setupRailwayRoutes() {
    return ROUTES.map(route => {
      if (route.qx && route.qy) {
        return new RouteCurved(route, this);
      }
      return new RouteStraight(route, this);
    });
  }


  /**
   * Create the board elements.
   * @return {Object}
   */
  setupElement() {
    return {
      board: create('div', { class: 'board' }),
      svg: createSvg('svg', {
        viewBox: `0 0 ${SIZES.board.width} ${SIZES.board.height}`,
      }),
      stations: createSvg('g', { class: 'stations' }),
      routes: createSvg('g', { class: 'routes' }),
      stationNames: createSvg('g', { class: 'station-names' }),
    };
  }


  /**
   * Render the board into the app container.
   */
  render() {
    for (const station of this.railway.stations) {
      this.element.stations.appendChild(station.element.station);
      this.element.stationNames.appendChild(station.element.name);
    }
    for (const route of this.railway.routes) {
      this.element.routes.appendChild(route.element);
    }

    this.element.svg.appendChild(this.element.routes);
    this.element.svg.appendChild(this.element.stations);
    this.element.svg.appendChild(this.element.stationNames);

    this.element.board.appendChild(this.element.svg);
    APP_CONTAINER.appendChild(this.element.board);
  }

}
