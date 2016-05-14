import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';


export class RoutePopup extends Component {

  constructor(props) {
    super(props);

    this.popup = props.ui.has('routePopup') ? props.ui.get('routePopup') : false;
    this.state = {
      cssClasses: 'route-popup',
    };
  }

  componentWillReceiveProps = nextProps => {
    if (nextProps.ui.has('routePopup')) {
      this.popup = nextProps.ui.get('routePopup');
      this.setState({
        cssClasses: `route-popup ${this.popup.get('route').get('type')} visible`,
      });
    } else {
      this.setState({
        cssClasses: 'route-popup',
      });
      setTimeout(() => {
        this.popup = false;
      }, 200);
    }
  }

  render() {
    if (!this.popup) return <div className={this.state.cssClasses}></div>;
    return (
      <div className={this.state.cssClasses}>
        <div className="title">
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
