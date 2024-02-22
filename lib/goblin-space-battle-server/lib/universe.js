// @ts-check
const {Elf, SmartId} = require('xcraft-core-goblin');
const {string} = require('xcraft-core-stones');
const {resourcesPath} = require('xcraft-core-host');
const {
  Celestial,
  CelestialLogic,
  CelestialShape,
} = require('goblin-space-battle/lib/celestial.js');
const {
  Exoplanet,
  ExoplanetState,
  ExoplanetShape,
  ExoplanetLogic,
} = require('goblin-space-battle/lib/exoplanet.js');
const {Ship, ShipLogic, ShipShape} = require('goblin-space-battle/lib/ship.js');

const {PassThrough} = require('node:stream');
const JSONStream = require('JSONStream');
const got = require('got');
const fse = require('fs-extra');
const checkType = require('xcraft-core-stones/check-type.js');
const path = require('node:path');

/* =============================== S1.P3 =============================== */
class Web {
  #jsonStream(stream) {
    const pt = new PassThrough({objectMode: true});
    return stream.pipe(JSONStream.parse('*')).pipe(pt);
  }

  async fetch(url) {
    const stream = got.stream.get(url);
    return this.#jsonStream(stream);
  }
}

class UniverseShape {
  id = string;
}

class UniverseState extends Elf.Sculpt(UniverseShape) {}

class UniverseLogic extends Elf.Spirit {
  state = new UniverseState({
    id: 'universe',
  });
}

/* =============================== S1.P1 =============================== */
class Universe extends Elf.Alone {
  desktopId = 'system@universe';
  web = new Web();

  async boot() {
    /* Load planets and  moons */
    await this._fetchCelestials();

    /* Load exoplanets */
    await this._fetchExoplanets();

    /* Init all ships */
    // await this._initShips();

    /* Start game */
    // FIXME: send started event at a specific time (use a CRON)
    this.quest.sub('*::universe.started', () =>
      setInterval(async () => await this.tick(), 1000)
    );
    setTimeout(() => this.quest.evt('started', {_xcraftRPC: true}), 5000);
  }

  async tick() {
    const reader = await this.cryo.reader(ShipLogic.db);
    const ships = reader
      .queryArchetype('ship', ShipShape)
      .field('id')
      .iterate();

    for (const shipId of ships) {
      const ship = await new Ship(this).create(shipId, this.desktopId);
      await ship.tick();
    }
  }

  /* =============================== S1.P2 =============================== */
  async _fetchCelestials() {
    const reader = await this.cryo.reader(CelestialLogic.db);
    /* FIXME: change once pickaxe supports aggregate / groupBy stuff */
    const count = reader
      .queryArchetype('celestial', CelestialShape)
      .field('id')
      .all().length;
    if (count) {
      return;
    }

    const planets = fse.readJSONSync(path.join(resourcesPath, 'planets.json'));
    const moons = fse.readJSONSync(path.join(resourcesPath, 'satellites.json'));

    const feedId = Elf.createFeed();
    this.quest.defer(async () => await this.killFeed(feedId));

    this.log.dbg('start of celestials fetching');
    this.quest.defer(() => this.log.dbg('end of celestials fetching'));

    for (const planet of planets) {
      const id = SmartId.from('celestial', planet.name.toLowerCase());
      await new Celestial(this).create(
        id,
        feedId,
        'planet',
        planet.distanceFromSun
      );
    }

    for (const moon of moons) {
      const id = SmartId.from('celestial', moon.name.toLowerCase());
      await new Celestial(this).create(
        id,
        feedId,
        'moon',
        planets[moon.planetId - 1].distanceFromSun
      );
    }
  }

  /* =============================== S1.P3 =============================== */
  async _fetchExoplanets() {
    const reader = await this.cryo.reader(ExoplanetLogic.db);
    /* FIXME: change once pickaxe supports aggregate / groupBy stuff */
    const count = reader
      .queryArchetype('exoplanet', ExoplanetShape)
      .field('id')
      .all().length;
    if (count) {
      return;
    }

    const exoStream = await this.web.fetch(
      'http://schroetersa.ch/exoplanets.json'
    );

    const feedId = Elf.createFeed();
    this.quest.defer(async () => await this.killFeed(feedId));

    this.log.dbg('start of exoplanets fetching');
    this.quest.defer(() => this.log.dbg('end of exoplanets fetching'));

    for await (const exoplanet of exoStream) {
      const id = SmartId.from('exoplanet', exoplanet.id.toLowerCase());

      const exoplanetState = new ExoplanetState({
        id,
        name: exoplanet.id,
        discoveryYear: exoplanet.year,
        distance: exoplanet.distance,
        mass: exoplanet.mass,
        radius: exoplanet.radius,
        stellarName: exoplanet.stellar,
      });

      const check = checkType(exoplanetState, ExoplanetShape);
      if (!check.ok) {
        this.log.warn(`Archetype:${id}, ${check.errorMessage}`);
        continue;
      }

      await new Exoplanet(this).insertOrReplace(id, feedId, exoplanetState);
    }
  }
}

module.exports = {Universe, UniverseLogic};
