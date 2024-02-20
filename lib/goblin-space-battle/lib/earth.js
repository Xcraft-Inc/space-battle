// @ts-check
const {Elf} = require('xcraft-core-goblin');
const {string} = require('xcraft-core-stones');

class EarthShape {
  id = string;
}

class EarthState extends Elf.Sculpt(EarthShape) {}

class EarthLogic extends Elf.Spirit {
  state = new EarthState({
    id: 'earth',
  });
}

class Earth extends Elf.Alone {
  logic = Elf.getLogic(EarthLogic);
  state = new EarthState();

  async boot() {}
}

module.exports = {Earth, EarthLogic};
