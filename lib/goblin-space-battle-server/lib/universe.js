// @ts-check
const {Elf, SmartId} = require('xcraft-core-goblin');
const {string} = require('xcraft-core-stones');
const {Celestial} = require('goblin-space-battle/lib/celestial.js');
const {
  Exoplanet,
  ExoplanetState,
  ExoplanetShape,
} = require('goblin-space-battle/lib/exoplanet.js');

const {PassThrough} = require('node:stream');
const JSONStream = require('JSONStream');
const got = require('got');
const checkType = require('xcraft-core-stones/check-type.js');

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

class Universe extends Elf.Alone {
  _desktopId = 'system@universe';
  _web = new Web();

  async boot() {
    /* Load exoplanets */
    await this._fetchExoplanets();

    /* Load planets */
    /* Load moons */
  }

  async _fetchExoplanets() {
    const exoStream = await this._web.fetch(
      'http://schroetersa.ch/exoplanets.json'
    );

    const feedId = Elf.createFeed();
    this.quest.defer(async () => await this.killFeed(feedId));

    for await (const exoplanet of exoStream) {
      const id = SmartId.from('exoplanet', exoplanet.id);

      const exoplanetState = new ExoplanetState({
        id: id,
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

  async _fetchPlanets() {}

  async _fetchMoons() {}
}

module.exports = {Universe, UniverseLogic};
