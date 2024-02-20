// @ts-check
const {Elf} = require('xcraft-core-goblin');
const {string, record, enumeration, number} = require('xcraft-core-stones');

class ShipShape {
  id = string;
  goods = record(enumeration('Fe', 'He-3', 'Pb', 'Ni', 'Ag'), number);
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
  }

  delete() {}
}

module.exports = {Ship, ShipLogic};
