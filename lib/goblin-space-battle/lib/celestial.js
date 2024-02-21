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
  state = new CelestialState({goods: {}});

  create(id, type, distance) {
    const {state} = this;
    state.id = id;
    state.type = type;
    state.distance = distance;

    /* Insert random elements on this celestial body */
    Element.values
      .filter(() => Math.round(Math.random()))
      .forEach(
        (element) => (state.goods[element] = Math.floor(Math.random() * 1000))
      );
  }
}

class Celestial extends Elf {
  logic = Elf.getLogic(CelestialLogic);
  state = new CelestialState();

  async create(id, desktopId, type, distance) {
    this.logic.create(id, type, distance);
    await this.persist();
  }

  delete() {}
}

module.exports = {Celestial, CelestialLogic, CelestialState};
