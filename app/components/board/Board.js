import './board.css';
import { SIZES, STATIONS, ROUTES } from '../../config';
import { qs, qsa, getDataset, addClass, removeClass } from '../../libs/dom';
import { delegate } from '../../libs/events';
import IO from '../communications/IO';
import Player from '../player/Player';
import RouteCurved from '../route/RouteCurved';
import RouteStraight from '../route/RouteStraight';
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


  listen() {
    IO.io.on('Route.claimed', this.renderUpdateRoutes);
    delegate('.route.unclaimed', this.el.routes, 'mouseover', this.mouseOverRoute);
    delegate('.route.unclaimed', this.el.routes, 'mouseout', this.mouseOutRoute);
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


  renderUpdateRoutes = data => {
    const route = this.railway.routes.find(r =>
      r.type === data.route.type
      && r.stations.start.slug === data.route.start.slug
      && r.stations.end.slug === data.route.end.slug
    );
    if (route) {
      route.setClaimed(data.player);

      if (data.player.id === Player.id) {
        const sameRoute = this.railway.routes.find(r =>
          r !== route &&
          r.stations.start.slug === route.stations.start.slug &&
          r.stations.end.slug === route.stations.end.slug
        );
        if (sameRoute) {
          sameRoute.setUnclaimable();
        }
      }
    }
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
