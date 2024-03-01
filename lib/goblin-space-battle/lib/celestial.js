// @ts-check
const {Elf} = require('xcraft-core-goblin');
const {id} = require('xcraft-core-goblin/lib/types.js');
const {number, objectMap, enumeration, option} = require('xcraft-core-stones');
const {Element} = require('./resources.js');
const battleConfig = require('xcraft-core-etc')().load('goblin-space-battle');

class CelestialShape {
  id = id('celestial');
  type = enumeration('planet', 'moon');
  distance = number;
  goods = objectMap(number);
  planetId = option(id('celestial'));
}

class CelestialState extends Elf.Sculpt(CelestialShape) {}

class CelestialLogic extends Elf.Archetype {
  static db = 'celestial';
  state = new CelestialState();

  create(id, type, distance, planetId) {
    const {state} = this;
    state.id = id;
    this.reset(type, distance, planetId);
  }

  reset(type, distance, planetId) {
    const {
      goodsPlanet,
      goodsMoon,
      distanceFar,
      distanceFarMul,
    } = battleConfig.celestial;
    const {state} = this;
    state.type = type;
    state.distance = distance;
    state.planetId = planetId;
    state.goods = {};

    /* The earth is out of resources */
    if (state.id === 'celestial@Earth') {
      return;
    }

    /* Insert random elements on this celestial body */
    let mul = state.type === 'planet' ? goodsPlanet : goodsMoon;

    /* Very far celestials have more ressources */
    if (state.distance > distanceFar) {
      mul *= distanceFarMul;
    }

    /* He-3 (fuel) is available on all celestials */
    Element.values
      .filter((element) => element === 'He-3' || Math.round(Math.random()))
      .forEach((el) => (state.goods[el] = Math.floor(Math.random() * mul) + 1));
  }

  collect() {
    const {collectQty} = battleConfig.celestial;
    const {state} = this;
    for (let [element, qty] of Object.entries(state.goods)) {
      if (qty > collectQty) {
        qty = collectQty;
      }
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

  /**
   * @param {*} id
   * @param {*} [desktopId]
   * @param {*} [type]
   * @param {*} [distance]
   * @param {*} [planetId]
   * @returns
   */
  async create(id, desktopId, type, distance, planetId) {
    this.logic.create(id, type, distance, planetId);
    await this.persist();
    return this;
  }

  async reset() {
    const {state} = this;
    this.logic.reset(state.type, state.distance, state.planetId);
    await this.persist();
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
