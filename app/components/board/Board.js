import './board.css';
import { SIZES, STATIONS, ROUTES } from '../../config';
import { qs, qsa, getDataset, addClass, removeClass } from '../../libs/dom';
import { delegate } from '../../libs/events';
import RouteStraight from '../route/RouteStraight';
import RouteCurved from '../route/RouteCurved';
import Station from '../station/Station';


export default class Board {


  constructor() {
    this.railway = {
      stations: STATIONS.map(station => new Station(station)),
      routes: ROUTES.map(route => {
        if (route.qx && route.qy) {
          return new RouteCurved(route);
        }
        return new RouteStraight(route);
      }),
    };

    this.el = {
      board: qs('#board svg'),
      routes: document.getElementById('routes'),
      stations: document.getElementById('stations'),
      names: document.getElementById('station-names'),
    };

    this.listen();
  }


  render() {
    this.el.board.setAttributeNS(null, 'viewBox', `0 0 ${SIZES.board.width} ${SIZES.board.height}`);

    while (this.el.routes.firstChild) {
      this.el.routes.removeChild(this.el.routes.firstChild);
    }
    while (this.el.stations.firstChild) {
      this.el.stations.removeChild(this.el.stations.firstChild);
    }
    while (this.el.names.firstChild) {
      this.el.names.removeChild(this.el.names.firstChild);
    }

    for (const station of this.railway.stations) {
      this.el.stations.appendChild(station.el.station);
      this.el.names.appendChild(station.el.name);
    }
    for (const route of this.railway.routes) {
      this.el.routes.appendChild(route.el.path);
    }
  }


  listen() {
    delegate('.route.unclaimed', this.el.routes, 'mouseover', this.mouseOverRoute);
    delegate('.route.unclaimed', this.el.routes, 'mouseout', this.mouseOutRoute);
  }


  mouseOverRoute = e => {
    const dataset = getDataset(e.target);
    const stations = qsa(
      `[data-station="${dataset.stationStart}"], [data-station="${dataset.stationEnd}"]`
    );
    [...stations].forEach(station => {
      addClass(station, 'highlight');
    });
  }

  mouseOutRoute = e => {
    const dataset = getDataset(e.target);
    const stations = qsa(
      `[data-station="${dataset.stationStart}"], [data-station="${dataset.stationEnd}"]`
    );
    [...stations].forEach(station => {
      removeClass(station, 'highlight');
    });
  }

}
