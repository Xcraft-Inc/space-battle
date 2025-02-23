// @ts-check
const {Elf} = require('xcraft-core-goblin');
const {string} = require('xcraft-core-stones');
const {Ship, ShipShape} = require('goblin-space-battle/lib/ship.js');
const {
  CelestialLogic,
  CelestialShape,
} = require('goblin-space-battle/lib/celestial.js');
const {
  ExoplanetLogic,
  ExoplanetShape,
} = require('goblin-space-battle/lib/exoplanet.js');
const shipConfig = require('xcraft-core-etc')().load(
  'goblin-space-battle-ship'
);

const {pilot} = shipConfig.galactica;

class GalacticaShape {
  id = string;
  pilot = string;
}

class GalacticaState extends Elf.Sculpt(GalacticaShape) {}

class GalacticaLogic extends Elf.Spirit {
  state = new GalacticaState({
    id: 'galactica',
    pilot,
  });
}

/* =============================== P1.S1 =============================== */
class Galactica extends Elf.Alone {
  state = new GalacticaState();

  async getPilot() {
    const {state} = this;
    return state.pilot;
  }

  /* =============================== P1.S4 =============================== */
  async preload() {
    let results;
    let result;
    const reader = await this.cryo.reader(ExoplanetLogic.db);

    this.log.dbg('Exoplanets discovered before 1997');

    results = reader
      .queryArchetype('exoplanet', ExoplanetShape)
      .fields(['name', 'discoveryYear'])
      .where((exo) => exo.get('discoveryYear').lte(1996))
      .iterate();
    for (const result of results) {
      this.log.dbg(`→ ${result.name} (${result.discoveryYear})`);
    }

    this.log.dbg('Exoplanets between 550 and 560 parsecs');

    results = reader
      .queryArchetype('exoplanet', ExoplanetShape)
      .fields(['name', 'distance'])
      .where((exo, $) =>
        $.and(exo.get('distance').gte(550), exo.get('distance').lte(560))
      )
      .iterate();
    for (const result of results) {
      this.log.dbg(`→ ${result.name} (${result.distance})`);
    }

    this.log.dbg('Exoplanets with mostly the same radius that the earth');

    results = reader
      .queryArchetype('exoplanet', ExoplanetShape)
      .fields(['name', 'radius'])
      .where((exo, $) =>
        $.and(exo.get('radius').lt(1.01), exo.get('radius').gt(0.99))
      )
      .orderBy((exo) => exo.get('radius'))
      .iterate();
    for (const result of results) {
      this.log.dbg(`→ ${result.name} (${result.radius})`);
    }

    this.log.dbg('Exoplanets count by discovery year');

    results = reader
      .queryArchetype('exoplanet', ExoplanetShape)
      .select((exoplanet, $) => ({
        discoveryYear: exoplanet.get('discoveryYear'),
        count: $.count(),
      }))
      .groupBy((exoplanet) => exoplanet.get('discoveryYear'))
      .iterate();
    for (const result of results) {
      this.log.dbg(`→ ${result.discoveryYear} ${result.count}`);
    }

    this.log.dbg('Exoplanet with the biggest mass');

    result = reader
      .queryArchetype('exoplanet', ExoplanetShape)
      .select((exoplanet, $) => ({
        name: exoplanet.get('name'),
        max: $.max(exoplanet.get('mass')),
      }))
      .get();
    this.log.dbg(`→ ${result?.name} ${result?.max}`);

    this.log.dbg('Number of Exoplanets in the database');

    result = reader
      .queryArchetype('exoplanet', ExoplanetShape)
      .select((exoplanet, $) => ({count: $.count()}))
      .get();
    this.log.dbg(`→ ${result?.count}`);
  }

  /* =============================== P2 =============================== */
  /** @param {t<ShipShape>} state */
  async tick(state) {
    const reader = await this.cryo.reader(CelestialLogic.db);
    const ship = await new Ship(this).api(state.id);

    const {position, destination, goods} = state;

    /* Check where we are and if there are resources to collect */
    if (!destination) {
      const goods = reader
        .queryArchetype('celestial', CelestialShape)
        .field('goods')
        .where((celestial) => celestial.get('id').eq(position))
        .get();
      if (goods && Object.values(goods).some((element) => element > 0)) {
        await ship.collect();
        return;
      }
      /* Nothing interesting here, look for a destination */
    } else if (destination) {
      /* Check if the actuel destination have (still) goods */
      const goods = reader
        .queryArchetype('celestial', CelestialShape)
        .field('goods')
        .where((celestial) => celestial.get('id').eq(destination))
        .get();
      if (goods && Object.values(goods).some((element) => element > 0)) {
        /* Continue with the actual destination */
        await ship.goto(destination);
        return;
      }
      /* Try to change of destination */
    }

    /* Get current fuel */
    const fuel = goods['He-3'];

    /* Max possible distance with current fuel */
    let maxDistance = fuel / 1.5;

    /* Search celestials */
    let results = [];
    for (let i = 10; i >= 0 && !results?.length; --i) {
      const He3 = 10 * i;
      results = await this._search(maxDistance, position, He3);
    }

    if (results?.length) {
      await ship.goto(results[0].id);
    } else {
      this.log.dbg('Lost in space');
    }
  }

  /**
   * @param {number} maxDistance
   * @param {*} position
   * @param {number} fuel
   * @returns
   */
  async _search(maxDistance, position, fuel) {
    const reader = await this.cryo.reader(CelestialLogic.db);

    const shipPos = reader
      .queryArchetype('celestial', CelestialShape)
      .field('distance')
      .where((celestial) => celestial.get('id').eq(position))
      .get();

    if (!shipPos) {
      return [];
    }

    return reader
      .queryArchetype('celestial', CelestialShape)
      .fields(['id', 'distance', 'goods'])
      .where((celestial, $) =>
        $.and(
          celestial.get('goods').get('He-3').gt(fuel) /* With a bit of fuel */,
          $.lt($.abs(celestial.get('distance').minus(shipPos)), maxDistance)
        )
      )
      .orderBy((celestial, $) =>
        $.desc(celestial.get('goods').select((value) => $.sum(value)))
      )
      .all();
  }
}

module.exports = {Galactica, GalacticaLogic};
