import './board.css';
import { APP_CONTAINER, SIZES, STATIONS } from '../../config';
import { create, createSvg } from '../../libs/dom';
import Station from '../station';


/** Class representing the game board. */
export default class Board {


  /**
   * Create the game board.
   */
  constructor() {
    this.railway = this.setupRailway();
    this.element = this.setupElement();
    this.render();
  }


  /**
   * Setup the railway.
   * @return {Object}
   */
  setupRailway() {
    return {
      stations: STATIONS.map(station => new Station(station)),
    };
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

    this.element.svg.appendChild(this.element.routes);
    this.element.svg.appendChild(this.element.stations);
    this.element.svg.appendChild(this.element.stationNames);

    this.element.board.appendChild(this.element.svg);
    APP_CONTAINER.appendChild(this.element.board);
  }

}
