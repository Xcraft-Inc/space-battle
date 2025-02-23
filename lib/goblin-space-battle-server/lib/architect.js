// @ts-check
const {Elf, SmartId} = require('xcraft-core-goblin');
const {checkType} = require('xcraft-core-stones');
const {resourcesPath} = require('xcraft-core-host');
const path = require('node:path');
const got = require('got');
const fse = require('fs-extra');
const {PassThrough} = require('node:stream');
const JSONStream = require('JSONStream');
const {
  CelestialLogic,
  CelestialShape,
  Celestial,
} = require('goblin-space-battle/lib/celestial.js');
const {
  Exoplanet,
  ExoplanetShape,
  ExoplanetLogic,
} = require('goblin-space-battle/lib/exoplanet.js');

/* =============================== P1.S3 =============================== */
class Web {
  #jsonStream(stream) {
    const pt = new PassThrough({objectMode: true});
    return stream.pipe(JSONStream.parse('*')).pipe(pt);
  }

  async fetch(url) {
    // @ts-ignore
    const stream = got.stream.get(url);
    return this.#jsonStream(stream);
  }
}

class Architect extends Elf.Alone {
  _web = new Web();

  /* =============================== P1.S2 =============================== */
  async fetchCelestials() {
    const reader = await this.cryo.reader(CelestialLogic.db);
    const result = reader
      .queryArchetype('celestial', CelestialShape)
      .select((_, $) => ({count: $.count()}))
      .get();
    if (result?.count) {
      return;
    }

    const planets = fse.readJSONSync(path.join(resourcesPath, 'planets.json'));
    const moons = fse.readJSONSync(path.join(resourcesPath, 'satellites.json'));
    const planetsMap = {};

    const feedId = Elf.createFeed();
    this.quest.defer(async () => await this.killFeed(feedId));

    this.log.dbg('start of celestials fetching');
    this.quest.defer(() => this.log.dbg('end of celestials fetching'));

    for (const planet of planets) {
      const id = SmartId.from('celestial', planet.name);
      planetsMap[planet.id] = id;
      await new Celestial(this).create(
        id,
        feedId,
        'planet',
        planet.distanceFromSun
      );
    }

    for (const moon of moons) {
      const id = SmartId.from('celestial', moon.name);
      await new Celestial(this).create(
        id,
        feedId,
        'moon',
        planets[moon.planetId - 1].distanceFromSun,
        planetsMap[moon.planetId]
      );
    }
  }

  /* =============================== P1.S3 =============================== */
  async fetchExoplanets() {
    const reader = await this.cryo.reader(ExoplanetLogic.db);
    const result = reader
      .queryArchetype('exoplanet', ExoplanetShape)
      .select((_, $) => ({count: $.count()}))
      .get();
    if (result?.count) {
      return;
    }

    const exoStream = await this._web.fetch(
      'http://schroetersa.ch/exoplanets.json'
    );

    const feedId = Elf.createFeed();
    this.quest.defer(async () => await this.killFeed(feedId));

    this.log.dbg('start of exoplanets fetching');
    this.quest.defer(() => this.log.dbg('end of exoplanets fetching'));

    const cryo = this.quest.getAPI('cryo');
    await cryo.begin({db: ExoplanetLogic.db});
    this.quest.defer(async () => await cryo.commit({db: ExoplanetLogic.db}));

    for await (const exoplanet of exoStream) {
      const id = SmartId.from('exoplanet', exoplanet.id);

      const exoplanetState = {
        id,
        name: exoplanet.id,
        discoveryYear: exoplanet.year,
        distance: exoplanet.distance,
        mass: exoplanet.mass,
        radius: exoplanet.radius,
        stellarName: exoplanet.stellar,
      };

      const check = checkType(exoplanetState, ExoplanetShape);
      if (!check.ok) {
        this.log.warn(`Archetype:${id}, ${check.errorMessage}`);
        continue;
      }

      await new Exoplanet(this).insertOrReplace(id, feedId, check.value);
    }
  }
}

module.exports = {Architect};
