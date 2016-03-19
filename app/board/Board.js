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

    this.railway = {
      routes: ROUTES.map(route => {
        if (route.qx && route.qy) {
          return new RouteCurved(route, this);
        }
        new RouteStraight(route, this);
      }),
      stations: STATIONS.map(station => new Station(station, this)),
    };

    this.render();
  }

  render() {
    this.element.appendChild(this.svg);
    APP_CONTAINER.appendChild(this.element);
  }

}
