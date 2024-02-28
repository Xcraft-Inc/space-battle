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
    const {ship, celestials, score} = this.props;

    const shipName = capitalize(ship.get('id').split('@')[1]);
    const posId = ship.get('position');
    const destId = ship.get('destination');
    const posName = capitalize(decodeURIComponent(posId.split('@')[1]));
    const distance = ship.get('distance');
    const destName =
      destId && capitalize(decodeURIComponent(destId.split('@')[1]));
    const dist = distance ? (100 * ship.get('delta')) / distance : 0;
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
        <div className={this.styles.classNames.large}>
          <strong>{shipName}</strong>
        </div>
        {(posId && destId && (
          <div>
            In transit {dist.toFixed(0)}%
            <br />
            <strong>{posName}</strong> → <strong>{destName}</strong>
          </div>
        )) || (
          <div>
            Stationed on <strong>{posName}</strong>&nbsp;
            {posName === 'Earth' ? '🌍' : ''}
            <span className={this.styles.classNames.small}>{descr}</span>
            <br />
            &nbsp;
          </div>
        )}
        <div className={this.styles.classNames.goods}>
          {goods
            .entrySeq()
            .filter(([element]) => element === 'He-3')
            .map(([element, good], key) => (
              <div key={key}>
                Fuel {element} &nbsp;&nbsp;: <strong>{good.toFixed(0)}</strong>
              </div>
            ))}
          <div>
            Total goods : <strong>{score.get('total')}</strong>
          </div>
        </div>
      </div>
    );
  }
}

class Score extends Widget {
  constructor() {
    super(...arguments);
    this.styles = styles;
  }

  render() {
    const {shipId, score} = this.props;

    const shipName = capitalize(shipId.split('@')[1]);

    return (
      <tr>
        <td>{shipName}</td>
        <td>{score.get('Fe')}</td>
        <td>{score.get('Pb')}</td>
        <td>{score.get('Ni')}</td>
        <td>{score.get('Ag')}</td>
        <td>{score.get('Cu')}</td>
        <td className={this.styles.classNames.total}>{score.get('total')}</td>
        <td className={this.styles.classNames.best}>
          {score.get('best') > 0 && score.get('best')}
        </td>
      </tr>
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
      status: 'status',
      ships: 'ships',
      celestials: 'celestials',
      scores: 'scores',
      prevScores: 'prevScores',
    };
  }

  render() {
    return (
      <div className={this.styles.classNames.space}>
        <h2>
          Space Battle{' '}
          <span className={this.styles.classNames.status}>
            ({this.props.status})
          </span>
        </h2>
        <div className={this.styles.classNames.ships}>
          {this.props?.ships?.map((ship, key) => (
            <Ship
              ship={ship}
              celestials={this.props.celestials}
              score={this.props?.scores?.get(ship.get('id'))}
              key={key}
            />
          ))}
        </div>
        <table className={this.styles.classNames.scores}>
          <thead>
            <tr>
              <td colSpan="8">
                <h2>Hall of Fame</h2>
              </td>
            </tr>
            <tr>
              <td colSpan="8">
                <h3>Score</h3>
              </td>
            </tr>
            <tr>
              <th>Pilot</th>
              <th>Fe</th>
              <th>Pb</th>
              <th>Ni</th>
              <th>Ag</th>
              <th>Cu</th>
              <th>Total</th>
              <th>Best</th>
            </tr>
          </thead>
          <tbody>
            {this.props?.scores
              ?.entrySeq()
              .sort(([, scoreA], [, scoreB]) =>
                scoreA.get('total') < scoreB.get('total') ? 1 : -1
              )
              .map(([shipId, score]) => (
                <Score key={shipId} shipId={shipId} score={score} />
              ))}{' '}
            <tr>
              <td colSpan="8">
                <h3>Previous score</h3>
              </td>
            </tr>
            {this.props?.prevScores
              ?.entrySeq()
              .sort(([, scoreA], [, scoreB]) =>
                scoreA.get('total') < scoreB.get('total') ? 1 : -1
              )
              .map(([shipId, score]) => (
                <Score key={shipId} shipId={shipId} score={score} />
              ))}
          </tbody>
        </table>
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
