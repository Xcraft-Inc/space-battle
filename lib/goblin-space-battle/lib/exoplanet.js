// @ts-check
const {Elf} = require('xcraft-core-goblin');
const {id} = require('xcraft-core-goblin/lib/types.js');
const {string, number, option} = require('xcraft-core-stones');

class ExoplanetShape {
  id = id('exoplanet');
  name = string;
  discoveryYear = number;
  radius = option(number); /* Earth Radius */
  mass = option(number); /* Earth Mass */
  distance = option(number); /* parsec */
  stellarName = string;
}

class ExoplanetState extends Elf.Sculpt(ExoplanetShape) {}

class ExoplanetLogic extends Elf.Archetype {
  static db = 'exoplanet';
  state = new ExoplanetState();

  create(id, name, year, radius, mass, distance, stellar) {
    const {state} = this;
    state.id = id;
    state.name = name;
    state.discoveryYear = year;
    state.radius = radius;
    state.mass = mass;
    state.distance = distance;
    state.stellarName = stellar;
  }
}

class Exoplanet extends Elf {
  logic = Elf.getLogic(ExoplanetLogic);
  state = new ExoplanetState();

  async create(id, desktopId, name, year, radius, mass, distance, stellar) {
    this.logic.create(id, name, year, radius, mass, distance, stellar);
    await this.persist();
    return this;
  }

  async beforePersistOnServer() {
    throw new Error('Forbidden');
  }

  delete() {}
}

module.exports = {Exoplanet, ExoplanetLogic, ExoplanetState, ExoplanetShape};
