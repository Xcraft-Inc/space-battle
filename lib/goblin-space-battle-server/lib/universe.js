// @ts-check
const {Elf} = require('xcraft-core-goblin');
const {
  string,
  array,
  object,
  number,
  enumeration,
  record,
} = require('xcraft-core-stones');
const {
  Celestial,
  CelestialLogic,
  CelestialShape,
} = require('goblin-space-battle/lib/celestial.js');
const {Ship, ShipLogic, ShipShape} = require('goblin-space-battle/lib/ship.js');
const {Chronomancer} = require('goblin-chronomancer/lib/chronomancer.js');
const {Architect} = require('./architect.js');

class ScoreShape {
  Fe = number;
  Pb = number;
  Ni = number;
  Ag = number;
  Cu = number;
  total = number;
  best = number;
}

class UniverseShape {
  id = string;
  status = enumeration('running', 'waiting');
  ships = array(object);
  celestials = record(string, object);
  scores = record(string, ScoreShape);
  prevScores = record(string, ScoreShape);
}

class UniverseState extends Elf.Sculpt(UniverseShape) {}

class UniverseLogic extends Elf.Spirit {
  state = new UniverseState({
    id: 'universe',
    status: 'waiting',
    ships: [],
    celestials: {},
    scores: {},
    prevScores: {},
  });

  boot(celestials) {
    const {state} = this;
    state.celestials = celestials;
  }

  tick(ships) {
    const {state} = this;

    for (const ship of ships) {
      if (!state.scores[ship.id]) {
        state.scores[ship.id] = {
          Fe: 0,
          Pb: 0,
          Ni: 0,
          Ag: 0,
          Cu: 0,
          total: 0,
          best: 0,
        };
      }
      const score = state.scores[ship.id];
      score.Fe = ship.goods.Fe;
      score.Pb = ship.goods.Pb;
      score.Ni = ship.goods.Ni;
      score.Ag = ship.goods.Ag;
      score.Cu = ship.goods.Cu;
      score.total = score.Fe + score.Pb + score.Ni + score.Ag + score.Cu;
    }

    state.ships = ships;
  }

  start() {
    const {state} = this;
    state.status = 'running';
  }

  reset() {
    const {state} = this;
    state.status = 'waiting';

    for (const ship of this.state.ships) {
      if (!state.scores[ship.id]) {
        state.scores[ship.id] = {
          Fe: 0,
          Pb: 0,
          Ni: 0,
          Ag: 0,
          Cu: 0,
          total: 0,
          best: 0,
        };
      }
      if (!state.prevScores[ship.id]) {
        state.prevScores[ship.id] = {
          Fe: 0,
          Pb: 0,
          Ni: 0,
          Ag: 0,
          Cu: 0,
          total: 0,
          best: 0,
        };
      }
      const score = state.scores[ship.id];
      const prevScore = state.prevScores[ship.id];
      prevScore.Fe = score.Fe;
      prevScore.Pb = score.Pb;
      prevScore.Ni = score.Ni;
      prevScore.Ag = score.Ag;
      prevScore.Cu = score.Cu;
      prevScore.total = score.total;
      if (score.total > prevScore.best) {
        prevScore.best = score.total;
      }
    }
  }
}

class Universe extends Elf.Alone {
  logic = Elf.getLogic(UniverseLogic);

  _desktopId = 'system@universe';
  _cron;

  async boot() {
    const architect = new Architect(this);

    /* Load planets and  moons */
    await architect.fetchCelestials();

    /* Load exoplanets */
    await architect.fetchExoplanets();

    /* Init game */
    await this._initShips();
    const readerCelest = await this.cryo.reader(CelestialLogic.db);
    const celestials = readerCelest
      .queryArchetype('celestial', CelestialShape)
      .fields(['id', 'type', 'planetId'])
      .all();
    this.logic.boot(
      celestials.reduce((map, celest) => {
        map[celest.id] = celest;
        return map;
      }, {})
    );

    this.quest.sub(
      '*::universe.started',
      async () => await this._cron.start('tick')
    );

    this._cron = new Chronomancer(this);

    await this._cron.upsert('reset', '30 3/4 * * * *', 'universe.reset'); // 4min
    await this._cron.upsert('start', '0 */4 * * * *', 'universe.start'); // 4min 30s
    await this._cron.upsert('tick', '*/2 * * * * *', 'universe.tick'); // 2s

    await this._cron.start('start');
    await this._cron.start('reset');
  }

  async start() {
    this.logic.start();
    this.quest.evt('started', {_xcraftRPC: true});
  }

  async reset() {
    this.logic.reset();

    /* Init all ships and celestials */
    await this._initShips();
    await this._initCelestials();

    await this._cron.stop('tick');
  }

  async tick() {
    const readerShip = await this.cryo.reader(ShipLogic.db);
    const ships = readerShip
      .queryArchetype('ship', ShipShape)
      .fields(['id', 'delta', 'destination', 'goods', 'position', 'distance'])
      .all();
    this.logic.tick(ships);

    for (const shipId of ships.map(({id}) => id)) {
      const ship = await new Ship(this).create(shipId, this._desktopId);
      await ship.tick();
    }
  }

  async _initShips() {
    const reader = await this.cryo.reader(ShipLogic.db);
    const ships = reader
      .queryArchetype('ship', ShipShape)
      .field('id')
      .iterate();

    for (const shipId of ships) {
      const ship = await new Ship(this).create(shipId, this._desktopId);
      await ship.reset();
    }
  }

  async _initCelestials() {
    const reader = await this.cryo.reader(CelestialLogic.db);
    const celestials = reader
      .queryArchetype('celestial', CelestialShape)
      .field('id')
      .iterate();

    for (const celestialId of celestials) {
      const celestial = await new Celestial(this).create(
        celestialId,
        this._desktopId
      );
      await celestial.reset();
    }
  }
}

module.exports = {Universe, UniverseLogic};
