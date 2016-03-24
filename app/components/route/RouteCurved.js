import { bezierLength } from '../../libs/math';
import Route from './Route';


/**
 * Class representing a curved route.
 * @extends Route
 */
export default class RouteCurved extends Route {


  /**
   * Create the curved route.
   * @param {Object} route The route information.
   * @param {Board}  board The game board.
   */
  constructor(route, board) {
    super(route, board);

    this.bezier = {
      p0: { x: this.stations.start.x, y: this.stations.start.y },
      p1: { x: route.qx, y: route.qy },
      p2: { x: this.stations.end.x, y: this.stations.end.y },
    };
    if (route.displace) {
      this.bezier.p1.x += route.displace.qx;
      this.bezier.p1.y += route.displace.qy;
    }

    this.setPathAttributes();
  }


  /**
   * Calculate the route's path description attribute.
   * @return {string}
   */
  pathD() {
    const d = [
      'M', this.bezier.p0.x, this.bezier.p0.y,
      'Q', this.bezier.p1.x, this.bezier.p1.y,
      this.bezier.p2.x, this.bezier.p2.y,
    ];
    return d.join(' ');
  }


  /**
   * Calculate the route's path length.
   * @return {number}
   */
  pathLength() {
    return bezierLength(this.bezier.p0, this.bezier.p1, this.bezier.p2);
  }

}
