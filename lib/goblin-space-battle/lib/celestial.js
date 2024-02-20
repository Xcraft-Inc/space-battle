// @ts-check
const {Elf} = require('xcraft-core-goblin');
const {id} = require('xcraft-core-goblin/lib/types.js');
const {number, record, enumeration} = require('xcraft-core-stones');
const {Element} = require('./resources.js');

class CelestialShape {
  id = id('celestial');
  type = enumeration('planet', 'moon');
  distance = number;
  goods = record(Element, number);
}

class CelestialState extends Elf.Sculpt(CelestialShape) {}

class CelestialLogic extends Elf.Archetype {
  static db = 'celestial';
  state = new CelestialState();

  create(id, type, distance, goods) {
    const {state} = this;
    state.id = id;
    state.type = type;
    state.distance = distance;
    state.goods = goods;
  }
}

class Celestial extends Elf {
  logic = Elf.getLogic(CelestialLogic);
  state = new CelestialState();

  async create(id, desktopId, type, distance) {
    // Fetch goods
    const goods = {};
    this.logic.create(id, type, distance, goods);
    await this.persist();
  }

  delete() {}
}

module.exports = {Celestial, CelestialLogic, CelestialState};
