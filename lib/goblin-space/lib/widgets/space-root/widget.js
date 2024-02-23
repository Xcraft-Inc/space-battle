import React from 'react';
import Widget from 'goblin-laboratory/widgets/widget';
import WithDesktopId from 'goblin-laboratory/widgets/with-desktop-id/widget';
import * as styles from './styles.js';

/******************************************************************************/

class ShipNC extends Widget {
  constructor() {
    super(...arguments);
    this.styles = styles;
  }

  static get wiring() {
    return {
      id: 'id',
      position: 'position',
      destination: 'destination',
      delta: 'delta',
      goods: 'goods',
    };
  }

  render() {
    return (
      <div className={this.styles.classNames.ship}>
        <div>{this.props.id}</div>
        <div>From: {this.props.position}</div>
        <div>Distance: {this.props.delta}</div>
        <div>To: {this.props.destination}</div>
        <div>
          Goods:
          {this.props.goods.keySeq().map((good, key) => (
            <div key={key}>
              {good} : {this.props.goods.get(good)}
            </div>
          ))}
        </div>
      </div>
    );
  }
}

const Ship = Widget.Wired(ShipNC);

class SpaceNC extends Widget {
  constructor() {
    super(...arguments);
    this.styles = styles;
  }

  static get wiring() {
    return {
      ships: 'ships',
    };
  }

  render() {
    return (
      <div className={this.styles.classNames.ships}>
        {this.props.ships.map((id, key) => (
          <Ship id={id} key={key} />
        ))}
      </div>
    );
  }
}

const Space = Widget.Wired(SpaceNC);

class SpaceRoot extends Widget {
  constructor() {
    super(...arguments);
    this.styles = styles;
  }

  render() {
    return (
      <WithDesktopId desktopId={this.props.id}>
        <Space id="space" />
      </WithDesktopId>
    );
  }
}

export default SpaceRoot;
