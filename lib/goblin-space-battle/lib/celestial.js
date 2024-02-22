// @ts-check
const {Elf} = require('xcraft-core-goblin');
const {id} = require('xcraft-core-goblin/lib/types.js');
const {number, objectMap, enumeration} = require('xcraft-core-stones');
const {Element} = require('./resources.js');

class CelestialShape {
  id = id('celestial');
  type = enumeration('planet', 'moon');
  distance = number;
  goods = objectMap(number);
}

class CelestialState extends Elf.Sculpt(CelestialShape) {}

class CelestialLogic extends Elf.Archetype {
  static db = 'celestial';
  state = new CelestialState();

  create(id, type, distance) {
    const {state} = this;
    state.id = id;
    state.type = type;
    state.distance = distance;
    state.goods = {};

    /* The earth is out of resources */
    if (state.id === 'celestial@earth') {
      return;
    }

    /* Insert random elements on this celestial body */
    const mul = state.type === 'planet' ? 1000 : 100;
    Element.values
      .filter(() => Math.round(Math.random()))
      .forEach((el) => (state.goods[el] = Math.floor(Math.random() * mul) + 1));
  }
}

class Celestial extends Elf {
  logic = Elf.getLogic(CelestialLogic);
  state = new CelestialState();

  async create(id, desktopId, type, distance) {
    this.logic.create(id, type, distance);
    await this.persist();
    return this;
  }

  delete() {}
}

module.exports = {Celestial, CelestialLogic, CelestialState, CelestialShape};
