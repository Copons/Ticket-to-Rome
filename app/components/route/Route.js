import './route.css';
import uuid from 'node-uuid';
import { SIZES, STATIONS } from '../../config';
import { createSvg, addClass, removeClass } from '../../libs/dom';
import RoutePopup from './RoutePopup';


export default class Route {


  constructor(route) {
    this.id = uuid.v4();
    this.type = route.type;
    this.parts = route.parts;
    this.claimed = false;
    this.stations = this.setStations(route);

    this.el = this.create();
    this.el.popup = new RoutePopup(this);
  }


  simplify() {
    return {
      id: this.id,
      type: this.type,
      parts: this.parts,
      start: {
        slug: this.stations.start.slug,
        name: this.stations.start.name,
      },
      end: {
        slug: this.stations.end.slug,
        name: this.stations.end.name,
      },
    };
  }


  setStations(route) {
    const stations = {
      start: Object.assign({},
        STATIONS.find(station => station.slug === route.start)
      ),
      end: Object.assign({},
        STATIONS.find(station => station.slug === route.end)
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


  create() {
    return {
      path: createSvg('path', {
        id: this.id,
        class: `route unclaimed ${this.type}`,
        'data-station-start': this.stations.start.slug,
        'data-station-end': this.stations.end.slug,
      }),
    };
  }


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


  setPathAttributes() {
    this.el.path.setAttributeNS(null, 'd', this.pathD());
    this.el.path.setAttributeNS(null,
      'stroke-dasharray', this.pathDashArray(this.pathLength())
    );
  }


  setClaimed(player) {
    this.claimed = true;
    removeClass(this.el.path, 'unclaimed');
    removeClass(this.el.path, this.type);
    addClass(this.el.path, 'claimed');
    addClass(this.el.path, player.color);
    this.el.path.removeAttribute('stroke-dasharray');
    this.el.popup.el.popup.destroy();
  }


  setUnclaimable() {
    this.claimed = true;
    removeClass(this.el.path, 'unclaimed');
    addClass(this.el.path, 'unclaimable');
    this.el.popup.el.popup.destroy();
  }

}
