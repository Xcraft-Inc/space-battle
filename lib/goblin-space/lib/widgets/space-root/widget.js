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
          <strong>{ship.get('id').split('@')[1]}</strong>
        </div>
        {(ship.get('position') && ship.get('destination') && (
          <div>
            In transit from{' '}
            <strong>
              {decodeURIComponent(ship.get('position').split('@')[1])}
            </strong>{' '}
            to{' '}
            <strong>
              {decodeURIComponent(ship.get('destination').split('@')[1])}
            </strong>{' '}
            : {((100 * ship.get('delta')) / ship.get('distance')).toFixed(0)}%
          </div>
        )) || (
          <div>
            Stationed on{' '}
            <strong>
              {decodeURIComponent(ship.get('position').split('@')[1])}
            </strong>{' '}
          </div>
        )}
        <div>
          Goods :
          {Object.entries(ship.get('goods').toJS()).map(
            ([element, good], key) => (
              <div key={key}>
                {element} : {good.toFixed(0)}{' '}
                {element === 'He-3' ? <strong>(fuel)</strong> : ''}
              </div>
            )
          )}
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
      celestials: 'celestials',
    };
  }

  render() {
    return (
      <div className={this.styles.classNames.ships}>
        {this.props?.ships?.map((ship, key) => (
          <Ship ship={ship} key={key} />
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
