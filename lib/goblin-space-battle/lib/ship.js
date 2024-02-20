// @ts-check
const {Elf} = require('xcraft-core-goblin');
const {string} = require('xcraft-core-stones');

class ShipShape {
  id = string;
}

class ShipState extends Elf.Sculpt(ShipShape) {}

class ShipLogic extends Elf.Archetype {
  static db = 'ship';
  state = new ShipState({
    id: 'galaxy',
  });
}

class Ship extends Elf {
  logic = Elf.getLogic(ShipLogic);
  state = new ShipState();

  async create(id, desktopId) {}

  delete() {}
}

module.exports = {Ship, ShipLogic};
