// @ts-check
const {Elf} = require('xcraft-core-goblin');
const {id} = require('xcraft-core-goblin/lib/types.js');
const {record, number} = require('xcraft-core-stones');
const {Element} = require('./resources.js');

class ShipShape {
  id = id('ship');
  position = id('celestial');
  goods = record(Element, number);
}

class ShipState extends Elf.Sculpt(ShipShape) {}

class ShipLogic extends Elf.Archetype {
  static db = 'ship';
  state = new ShipState({
    position: 'celestial@earth',
    goods: {
      'He-3': 1000 /* Initial fuel */,
      'Fe': 0,
      'Ag': 0,
      'Cu': 0,
      'Ni': 0,
      'Pb': 0,
    },
  });

  create(id) {
    const {state} = this;
    state.id = id;
  }

  beforePersistOnServer() {}

  goto(celestialId) {
    const {state} = this;
    state.position = celestialId;
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
    const state = await this.cryo.getState(ShipLogic.db, this.id, 'persist');
    if (!state) {
      return;
    }
    this.log.dbg(`${state.position} → ${this.state.position}`);
  }

  async goto(celestialId) {
    this.logic.goto(celestialId);
    await this.persist();
  }

  delete() {}
}

module.exports = {Ship, ShipLogic};
