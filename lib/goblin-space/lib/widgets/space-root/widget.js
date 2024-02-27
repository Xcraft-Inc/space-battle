import React from 'react';
import Widget from 'goblin-laboratory/widgets/widget';
import WithDesktopId from 'goblin-laboratory/widgets/with-desktop-id/widget';
import * as styles from './styles.js';

/******************************************************************************/

function capitalize(str) {
  return str.replace(/(^[a-z])/, (a) => a.toUpperCase());
}

class Ship extends Widget {
  constructor() {
    super(...arguments);
    this.styles = styles;
  }

  render() {
    const {ship, celestials} = this.props;

    const shipName = capitalize(ship.get('id').split('@')[1]);
    const posId = ship.get('position');
    const destId = ship.get('destination');
    const posName = capitalize(decodeURIComponent(posId.split('@')[1]));
    const destName =
      destId && capitalize(decodeURIComponent(destId.split('@')[1]));
    const dist = (100 * ship.get('delta')) / ship.get('distance');
    const goods = ship.get('goods');

    let descr = '';
    if (posId && !destId) {
      const celest = celestials.get(posId);
      if (celest && celest.get('type') === 'moon') {
        const planet = capitalize(
          decodeURIComponent(celest.get('planetId').split('@')[1])
        );
        descr = ` (moon of ${planet})`;
      }
    }

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
            Stationed on <strong>{posName}</strong> {descr}
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
          <Ship ship={ship} celestials={this.props.celestials} key={key} />
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
