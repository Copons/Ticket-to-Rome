import React, { PropTypes, Component } from 'react';
import { STATIONS } from '../../config/stations';


export default class Route extends Component {

  constructor(props) {
    super(props);
    this.route = this.props.route;

    this.stations = {
      start: Object.assign({},
        STATIONS.find(s => s.slug === this.route.start)
      ),
      end: Object.assign({},
        STATIONS.find(s => s.slug === this.route.end)
      ),
    };
    if (this.route.displace) {
      this.stations.start.x += this.route.displace.x1;
      this.stations.start.y += this.route.displace.y1;
      this.stations.end.x += this.route.displace.x2;
      this.stations.end.y += this.route.displace.y2;
    }

    this.state = { strokeDasharray: '' };
  }

  setPathD = () =>
    `M ${this.stations.start.x} ${this.stations.start.y} ` +
    `L ${this.stations.end.x} ${this.stations.end.y}`;

  setStrokeDasharray = pathLen => {
    const offset = 7;
    const gap = 1.5;
    const routeLen = pathLen - offset * 2 - (this.route.parts - 1) * gap;
    const dashLen = routeLen / this.route.parts;
    const dashes = [dashLen + offset, gap];
    for (let i = 0; i < this.route.parts - 1; i++) {
      dashes.push(dashLen);
      dashes.push(gap);
    }
    dashes.push(dashLen + offset);
    return dashes.join(', ');
  }

  componentDidMount() {
    if (this.state.strokeDasharray === '') {
      const pathLen = this.refs.path.getTotalLength();
      // eslint-disable-next-line
      this.setState({ strokeDasharray: this.setStrokeDasharray(pathLen) });
    }
  }

  render() {
    return (
      <path
        ref="path"
        className={`route unclaimed ${this.route.type}`}
        start={this.route.start}
        end={this.route.end}
        d={this.setPathD()}
        strokeDasharray={this.state.strokeDasharray}
      />
    );
  }

}

Route.propTypes = {
  route: PropTypes.object.isRequired,
};
