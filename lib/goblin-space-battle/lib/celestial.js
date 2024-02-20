// @ts-check
const {Elf} = require('xcraft-core-goblin');
const {string, number, record} = require('xcraft-core-stones');
const {Element} = require('./resources.js');

class CelestialShape {
  id = string;
  distance = number;
  goods = record(Element, number);
}

class CelestialState extends Elf.Sculpt(CelestialShape) {}

class CelestialLogic extends Elf.Archetype {
  static db = 'celestial';
  state = new CelestialState();

  create(id, distance, goods) {
    const {state} = this;
    state.id = id;
    state.distance = distance;
    state.goods = goods;
  }
}

class Celestial extends Elf {
  logic = Elf.getLogic(CelestialLogic);
  state = new CelestialState();

  async create(id, desktopId, distance, mass) {
    // Fetch goods
    const goods = {};
    this.logic.create(id, distance, goods);
    await this.persist();
  }

  delete() {}
}

module.exports = {Celestial, CelestialLogic};
