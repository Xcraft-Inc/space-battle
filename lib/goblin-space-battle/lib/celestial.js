// @ts-check
const {Elf} = require('xcraft-core-goblin');
const {string, number} = require('xcraft-core-stones');

class CelestialShape {
  id = string;
  distance = number;
  mass = number;
}

class CelestialState extends Elf.Sculpt(CelestialShape) {}

class CelestialLogic extends Elf.Archetype {
  static db = 'celestial';
  state = new CelestialState();

  create(id, distance, mass) {
    const {state} = this;
    state.id = id;
    state.distance = distance;
    state.mass = mass;
  }
}

class Celestial extends Elf {
  logic = Elf.getLogic(CelestialLogic);
  state = new CelestialState();

  async create(id, desktopId, distance, mass) {
    this.logic.create(id, distance, mass);
    await this.persist();
  }

  delete() {}
}

module.exports = {Celestial, CelestialLogic};
