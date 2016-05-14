import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import { STATIONS } from '../../config/stations';
import UI from '../../services/UI';


export class Route extends Component {

  constructor(props) {
    super(props);
    this.route = props.route;
    this.handleClick = props.handleClick;

    this.stations = this.setCoordinates();

    this.state = { strokeDasharray: '' };
  }

  setCoordinates = () => {
    const stations = {
      start: Object.assign({},
        STATIONS.find(s => s.slug === this.route.start)
      ),
      end: Object.assign({},
        STATIONS.find(s => s.slug === this.route.end)
      ),
    };
    if (this.route.displace) {
      stations.start.x += this.route.displace.x1;
      stations.start.y += this.route.displace.y1;
      stations.end.x += this.route.displace.x2;
      stations.end.y += this.route.displace.y2;
    }
    return stations;
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
        d={this.setPathD()}
        strokeDasharray={this.state.strokeDasharray}
        data-start={this.route.start}
        data-end={this.route.end}
        onClick={e => {
          if (e.target.classList.contains('unclaimed')) {
            this.handleClick({
              route: this.route,
              stations: this.stations,
            });
          }
        }}
      />
    );
  }

}

Route.propTypes = {
  route: PropTypes.object.isRequired,
  handleClick: PropTypes.func.isRequired,
};




export default connect(
  null,
  { handleClick: UI.toggleRoutePopupThunk }
)(Route);
