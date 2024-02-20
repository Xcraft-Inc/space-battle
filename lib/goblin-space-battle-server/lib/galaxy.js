// @ts-check
const {Elf} = require('xcraft-core-goblin');
const {string} = require('xcraft-core-stones');

class GalaxyShape {
  id = string;
}

class GalaxyState extends Elf.Sculpt(GalaxyShape) {}

class GalaxyLogic extends Elf.Spirit {
  state = new GalaxyState({
    id: 'galaxy',
  });
}

class Galaxy extends Elf.Alone {
  logic = Elf.getLogic(GalaxyLogic);
  state = new GalaxyState();

  async boot() {}
}

module.exports = {Galaxy, GalaxyLogic};
