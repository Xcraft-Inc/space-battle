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
    let mul = state.type === 'planet' ? 1000 : 100;

    /* Very far celestials have more ressources */
    if (state.distance > 500) {
      mul *= 3;
    }

    /* He-3 (fuel) is available on all celestials */
    Element.values
      .filter((element) => element === 'He-3' || Math.round(Math.random()))
      .forEach((el) => (state.goods[el] = Math.floor(Math.random() * mul) + 1));
  }

  collect() {
    const {state} = this;
    for (const [element, qty] of Object.entries(state.goods)) {
      state.goods[element] -= qty;
      if (state.goods[element] < 0) {
        state.goods[element] = 0;
      }
    }
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

  async collect() {
    const oldGoods = this.state.goods;
    this.logic.collect();
    const newGoods = this.state.goods;
    const extracted = {};
    for (const element of Object.keys(this.state.goods)) {
      extracted[element] = oldGoods[element] - newGoods[element];
    }
    await this.persist();
    return extracted;
  }

  async beforePersistOnServer() {
    throw new Error('Forbidden');
  }

  delete() {}
}

module.exports = {Celestial, CelestialLogic, CelestialState, CelestialShape};
