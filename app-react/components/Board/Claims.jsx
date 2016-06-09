import React, { PropTypes, Component } from 'react';
import Cards from '../../services/Cards';
import { Claim } from './Claim';

class Claims extends Component {

  setupClaims = () => {
    const colors = Cards.mapColors(this.props.hand);
    const wild = colors.has('wild') ? colors.get('wild') : 0;
    const claims = [];

    // TODO check player pieces!!

    console.log(wild);
    if (wild >= this.props.parts) {
      claims.push([{ color: 'wild', count: this.props.parts }]);
    }
    colors.forEach((count, color) => {
      if (color !== 'wild' && (this.props.type === 'wild' || this.props.type === color)) {
        if (count >= this.props.parts) {
          claims.push([{ color, count: this.props.parts }]);
        } else if (count + wild >= this.props.parts) {
          claims.push([
            { color, count },
            { color: 'wild', count: this.props.parts - count },
          ]);
        }
      }
    });

    return claims;
  }

  render() {
    const claims = this.setupClaims();
    console.log(claims);
    const title = claims.length ? 'Claim with:' : 'Unclaimable';
    return (
      <div className="claims">
        <div className="title">{title}</div>
        {claims.map((c, i) =>
          <Claim claim={c} key={i} />
        )}
      </div>
    );
  }

}

Claims.propTypes = {
  hand: PropTypes.object,
  type: PropTypes.string,
  parts: PropTypes.number,
};

export default Claims;
