import React from 'react';
import Widget from 'goblin-laboratory/widgets/widget';
import WithDesktopId from 'goblin-laboratory/widgets/with-desktop-id/widget';
import * as styles from './styles.js';

/******************************************************************************/

class Ship extends Widget {
  constructor() {
    super(...arguments);
    this.styles = styles;
  }

  render() {
    const {ship} = this.props;

    return (
      <div className={this.styles.classNames.ship}>
        <div>
          <strong>{ship.id.split('@')[1]}</strong>
        </div>
        {(ship.position && ship.destination && (
          <div>
            In transit from{' '}
            <strong>{decodeURIComponent(ship.position.split('@')[1])}</strong>{' '}
            to{' '}
            <strong>
              {decodeURIComponent(ship.destination.split('@')[1])}
            </strong>
          </div>
        )) || (
          <div>
            Stationed on{' '}
            <strong>{decodeURIComponent(ship.position.split('@')[1])}</strong>{' '}
          </div>
        )}
        <div>
          Goods:
          {Object.entries(ship.goods).map(([element, good], key) => (
            <div key={key}>
              {element} : {good.toFixed(2)}
            </div>
          ))}
        </div>
      </div>
    );
  }
}

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
        {this.props.ships.map((ship, key) => (
          <Ship ship={ship.toJS()} key={key} />
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
        <Space id="universe" />
      </WithDesktopId>
    );
  }
}

export default SpaceRoot;
