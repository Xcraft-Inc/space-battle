// @ts-check
const {Elf} = require('xcraft-core-goblin');
const {id} = require('xcraft-core-goblin/lib/types.js');
const {record, number, boolean, option} = require('xcraft-core-stones');
const {Element} = require('./resources.js');
const {CelestialLogic, CelestialShape, Celestial} = require('./celestial.js');

class ShipShape {
  id = id('ship');
  position = id('celestial');
  goods = record(Element, number);
  server = boolean;
  tick = number;

  delta = number;
  destination = option(id('celestial'));
  collect = boolean;
}

class ShipState extends Elf.Sculpt(ShipShape) {}

class ShipLogic extends Elf.Archetype {
  static db = 'ship';
  state = new ShipState();

  create(id) {
    const {state} = this;
    state.id = id;
    this.reset();
  }

  tick() {
    const {state} = this;
    state.server = true;
  }

  reset() {
    const {state} = this;
    state.position = 'celestial@earth';
    state.goods = {
      'He-3': 1000 /* Initial fuel */,
      'Fe': 0,
      'Ag': 0,
      'Cu': 0,
      'Ni': 0,
      'Pb': 0,
    };
    state.delta = 0;
    state.destination = null;
    state.collect = false;
    state.server = false;
    state.tick = 0;
  }

  /**
   * @param {number} tick
   * @param {number} srcDistance
   * @param {number|undefined} dstDistance
   * @param {*} shipGoods
   * @param {*} extractedGoods
   */
  beforePersistOnServer(
    tick,
    srcDistance,
    dstDistance,
    shipGoods,
    extractedGoods
  ) {
    const {state} = this;
    state.server = false;

    /* Ship navigation */
    if (state.destination && dstDistance) {
      /* Compute distance */
      const totalDistance = Math.abs(dstDistance - srcDistance);
      let delta = totalDistance - state.delta;
      const progress = delta > 100 ? 100 : delta;

      /* Compute fuel */
      let fuel = shipGoods['He-3'] - progress * 1.5;
      if (fuel < 0) {
        fuel = 0;
      }
      state.goods['He-3'] = fuel;

      if (fuel) {
        state.delta += progress;
        if (totalDistance - state.delta <= 0) {
          /* The ship is on the celestial body */
          state.delta = 0;
          state.position = state.destination;
          state.destination = null;
        }
      }
    }

    /* Ship collect resources */
    if (state.collect) {
      for (const element of Object.keys(extractedGoods)) {
        state.goods[element] += extractedGoods[element];
      }
      state.collect = false;
    }

    state.tick = tick;
  }

  goto(celestialId) {
    const {state} = this;
    state.server = false;
    if (state.position !== celestialId) {
      state.destination = celestialId;
    } else {
      state.destination = null;
    }
  }

  collect() {
    const {state} = this;
    state.server = false;
    state.collect = true;
  }
}

class Ship extends Elf {
  logic = Elf.getLogic(ShipLogic);
  state = new ShipState();

  _tick = 0;

  async create(id, desktopId) {
    this.logic.create(id);
    await this.persist();
    return this;
  }

  async goto(celestialId) {
    this.logic.goto(celestialId);
    await this.persist();
  }

  async collect() {
    this.logic.collect();
    await this.persist();
  }

  async tick() {
    this._tick++;
    this.logic.tick();
    await this.persist();
  }

  async reset() {
    this.logic.reset();
    await this.persist();
  }

  async beforePersistOnServer() {
    let src, dst;
    const shipReader = await this.cryo.reader(ShipLogic.db);
    const celestReader = await this.cryo.reader(CelestialLogic.db);

    /* Previous ship state */
    const old = shipReader
      .queryArchetype('ship', ShipShape)
      .fields(['id', 'position', 'delta', 'goods', 'destination', 'collect'])
      .where((ship) => ship.get('id').eq(this.id))
      .get();
    if (!old) {
      return;
    }

    /* Source celestial */
    src = await celestReader
      .queryArchetype('celestial', CelestialShape)
      .fields(['type', 'distance', 'goods'])
      .where((celest) => celest.get('id').eq(old.position))
      .get();

    const {destination, collect} = this.state;
    if (destination) {
      /* Destination celestial */
      dst = await celestReader
        .queryArchetype('celestial', CelestialShape)
        .fields(['type', 'distance', 'goods'])
        .where((celest) => celest.get('id').eq(destination))
        .get();
    }

    let extracted = {};

    /* Extract resources from the celestial */
    if (collect) {
      const celestial = await new Celestial(this).create(old.position);
      extracted = await celestial.collect();
    }

    this.logic.beforePersistOnServer(
      this._tick,
      src?.distance || 0,
      dst?.distance,
      old.goods,
      extracted
    );

    if (src && dst) {
      this.log.dbg(
        `[${this.state.id}] GOTO ${destination || this.state.position} fuel:${
          this.state.goods['He-3']
        } delta:${this.state.delta} distance:${Math.abs(
          dst?.distance - src?.distance
        )}`
      );
    }

    if (collect) {
      this.log.dbg(
        `[${this.state.id}] COLLECT on ${this.state.position} fuel:${
          this.state.goods['He-3']
        } goods:${JSON.stringify(this.state.goods)}`
      );
    }

    await this.persist();
  }

  delete() {}
}

module.exports = {Ship, ShipLogic, ShipState, ShipShape};
