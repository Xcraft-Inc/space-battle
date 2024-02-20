// @ts-check
const {Elf} = require('xcraft-core-goblin');
const {string} = require('xcraft-core-stones');
const {Celestial} = require('goblin-space-battle/lib/celestial.js');

class UniverseShape {
  id = string;
}

class UniverseState extends Elf.Sculpt(UniverseShape) {}

class UniverseLogic extends Elf.Spirit {
  state = new UniverseState({
    id: 'universe',
  });
}

class Universe extends Elf.Alone {
  logic = Elf.getLogic(UniverseLogic);
  state = new UniverseState();

  _desktopId = 'system@celestial';

  async boot() {}
}

module.exports = {Universe, UniverseLogic};
