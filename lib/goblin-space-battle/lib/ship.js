// @ts-check
const {Elf} = require('xcraft-core-goblin');
const {string, record, number} = require('xcraft-core-stones');
const {Element} = require('./resources.js');

class ShipShape {
  id = string;
  goods = record(Element, number);
}

class ShipState extends Elf.Sculpt(ShipShape) {}

class ShipLogic extends Elf.Archetype {
  static db = 'ship';
  state = new ShipState();

  create(id) {
    const {state} = this;
    state.id = id;
  }
}

class Ship extends Elf {
  logic = Elf.getLogic(ShipLogic);
  state = new ShipState();

  async create(id, desktopId) {
    this.logic.create(id);
    await this.persist();
  }

  delete() {}
}

module.exports = {Ship, ShipLogic};
