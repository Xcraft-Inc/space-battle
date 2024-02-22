// @ts-check
const {Elf} = require('xcraft-core-goblin');
const {id} = require('xcraft-core-goblin/lib/types.js');
const {record, number, boolean, option} = require('xcraft-core-stones');
const {Element} = require('./resources.js');
const {CelestialLogic, CelestialShape} = require('./celestial.js');

class ShipShape {
  id = id('ship');
  position = id('celestial');
  goods = record(Element, number);
  server = boolean;
  tick = number;

  delta = number;
  destination = option(id('celestial'));
}

class ShipState extends Elf.Sculpt(ShipShape) {}

class ShipLogic extends Elf.Archetype {
  static db = 'ship';
  state = new ShipState({
    id: undefined,
    position: 'celestial@earth',
    goods: {
      'He-3': 1000 /* Initial fuel */,
      'Fe': 0,
      'Ag': 0,
      'Cu': 0,
      'Ni': 0,
      'Pb': 0,
    },
    delta: 0,
    destination: null,
    server: false,
    tick: 0,
  });

  create(id) {
    const {state} = this;
    state.id = id;
  }

  /**
   * @param {number} srcDistance
   * @param {number} dstDistance
   * @param {*} shipGoods
   * @param {*} celestGoods
   */
  beforePersistOnServer(srcDistance, dstDistance, shipGoods, celestGoods) {
    const {state} = this;

    if (state.destination) {
      /* Compute distance */
      const totalDistance = Math.abs(dstDistance - srcDistance);
      let delta = totalDistance - state.delta;
      const progress = delta > 50 ? 50 : delta;

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
  }

  tick() {
    const {state} = this;
    state.tick++;
    state.server = true;
  }

  goto(celestialId) {
    const {state} = this;
    state.destination = celestialId;
    state.server = false;
  }
}

class Ship extends Elf {
  logic = Elf.getLogic(ShipLogic);
  state = new ShipState();

  async create(id, desktopId) {
    this.logic.create(id);
    await this.persist();
    return this;
  }

  async beforePersistOnServer() {
    const shipReader = await this.cryo.reader(ShipLogic.db);
    const celestReader = await this.cryo.reader(CelestialLogic.db);

    /* Previous ship state */
    const old = shipReader
      .queryArchetype('ship', ShipShape)
      .fields(['position', 'delta', 'goods'])
      .where((ship) => ship.get('id').eq(this.id))
      .get();
    if (!old) {
      return;
    }

    /* Source celestial */
    const src = await celestReader
      .queryArchetype('celestial', CelestialShape)
      .fields(['type', 'distance', 'goods'])
      .where((celest) => celest.get('id').eq(old.position))
      .get();

    const {destination} = this.state;
    if (destination) {
      /* Destination celestial */
      const dst = await celestReader
        .queryArchetype('celestial', CelestialShape)
        .fields(['type', 'distance', 'goods'])
        .where((celest) => celest.get('id').eq(destination))
        .get();

      if (src && dst) {
        this.logic.beforePersistOnServer(
          src.distance,
          dst.distance,
          old.goods,
          dst.goods
        );
        await this.persist();
      }
    }
  }

  async tick() {
    this.logic.tick();
    await this.persist();
  }

  async goto(celestialId) {
    this.logic.goto(celestialId);
    await this.persist();
  }

  delete() {}
}

module.exports = {Ship, ShipLogic, ShipState, ShipShape};
