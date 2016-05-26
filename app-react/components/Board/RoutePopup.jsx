import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';


export class RoutePopup extends Component {

  constructor(props) {
    super(props);

    this.popup = props.ui.has('routePopup') ? props.ui.get('routePopup') : false;
    this.state = {
      cssClasses: 'route-popup',
      cssStyle: {},
    };
  }

  getWindowCenter() {
    return {
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
    };
  }

  getPathCenter = () => {
    const pathRect = this.popup.get('path');
    return {
      x: (pathRect.left + pathRect.right) / 2,
      y: (pathRect.top + pathRect.bottom) / 2,
    };
  }

  setPopupPosition = () => {
    const position = {
      top: 'auto', rigth: 'auto', bottom: 'auto', left: 'auto',
    };
    const windowCenter = this.getWindowCenter();
    const pathCenter = this.getPathCenter();

    const offset = 20;

    if (pathCenter.x > windowCenter.x) {
      position.right = window.innerWidth - pathCenter.x + offset;
    } else {
      position.left = pathCenter.x + offset;
    }
    if (pathCenter.y > windowCenter.y) {
      position.bottom = window.innerHeight - pathCenter.y + offset;
    } else {
      position.top = pathCenter.y + offset;
    }

    return position;
  }

  componentWillReceiveProps = nextProps => {
    if (nextProps.ui.has('routePopup')) {
      this.popup = nextProps.ui.get('routePopup');
      this.setState({
        cssClasses: `route-popup ${this.popup.get('route').get('type')} visible`,
        cssStyle: this.setPopupPosition(),
      });
    } else {
      this.setState({
        cssClasses: 'route-popup',
        cssStyle: {},
      });
      setTimeout(() => {
        this.popup = false;
      }, 200);
    }
  }

  render() {
    if (!this.popup) return (
      <div
        className={this.state.cssClasses}
        style={this.state.cssStyle}
      />
    );
    return (
      <div
        className={this.state.cssClasses}
        style={this.state.cssStyle}
      >
        <div className="route">
          <span className="start">
            {this.popup.get('stations').get('start').get('name')}
          </span>
          <span className="end">
            {this.popup.get('stations').get('end').get('name')}
          </span>
        </div>
        <div className="content">
          <div className="parts">
            {[...Array(this.popup.get('route').get('parts'))].map((part, i) =>
              <span key={i}></span>
            )}
          </div>
          {this.popup.toString()}
        </div>
      </div>
    );
  }

}

RoutePopup.propTypes = {
  ui: PropTypes.object,
};




const mapStateToProps = state => ({
  ui: state.ui,
});

export default connect(mapStateToProps)(RoutePopup);
