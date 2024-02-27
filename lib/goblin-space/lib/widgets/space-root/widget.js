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

    const shipName = ship.get('id').split('@')[1];
    const posId = ship.get('position');
    const destId = ship.get('destination');
    const posName = decodeURIComponent(posId.split('@')[1]);
    const destName = destId && decodeURIComponent(destId.split('@')[1]);
    const dist = (100 * ship.get('delta')) / ship.get('distance');
    const goods = ship.get('goods');

    return (
      <div className={this.styles.classNames.ship}>
        <div>
          <strong>{shipName}</strong>
        </div>
        {(posId && destId && (
          <div>
            In transit from <strong>{posName}</strong> to{' '}
            <strong>{destName}</strong> : {dist.toFixed(0)}%
          </div>
        )) || (
          <div>
            Stationed on <strong>{posName}</strong>{' '}
          </div>
        )}
        <div>
          Goods :
          {Object.entries(goods.toJS()).map(([element, good], key) => (
            <div key={key}>
              {element} : {good.toFixed(0)}{' '}
              {element === 'He-3' ? <strong>(fuel)</strong> : ''}
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
