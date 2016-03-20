import './board.css';

import { create, createSvg } from '../utils/dom';
import { APP_CONTAINER, SIZES } from '../constants/layout';
import { STATIONS, ROUTES } from '../constants/railway';
import Station from '../station/Station';
import RouteStraight from '../route/RouteStraight';
import RouteCurved from '../route/RouteCurved';

export default class Board {

  constructor() {
    this.element = create('div', { class: 'board' });
    this.svg = createSvg('svg', {
      viewBox: `0 0 ${SIZES.boardWidth} ${SIZES.boardHeight}`,
    });

    this.elements = {
      board: create('div', { class: 'board' }),
      svg: createSvg('svg', { viewBox: `0 0 ${SIZES.boardWidth} ${SIZES.boardHeight}` }),
      stations: createSvg('g', { class: 'stations' }),
      routes: createSvg('g', { class: 'routes' }),
      names: createSvg('g', { class: 'names' }),
    };

    this.railway = {
      stations: STATIONS.map(station => new Station(station, this)),
      routes: ROUTES.map(route => {
        if (route.qx && route.qy) {
          return new RouteCurved(route, this);
        }
        new RouteStraight(route, this);
      }),
    };

    this.render();
  }

  render() {
    this.elements.svg.appendChild(this.elements.routes);
    this.elements.svg.appendChild(this.elements.stations);
    this.elements.svg.appendChild(this.elements.names);
    this.elements.board.appendChild(this.elements.svg);
    APP_CONTAINER.appendChild(this.elements.board);
  }

}
