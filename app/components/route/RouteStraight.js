import { lineLength } from '../../libs/math';
import Route from './Route';


export default class RouteStraight extends Route {


  constructor(route) {
    super(route);

    this.setPathAttributes();
  }


  pathD() {
    const d = [
      'M', this.stations.start.x, this.stations.start.y,
      'L', this.stations.end.x, this.stations.end.y,
    ];
    return d.join(' ');
  }


  pathLength() {
    return lineLength(this.stations.start, this.stations.end);
  }

}
