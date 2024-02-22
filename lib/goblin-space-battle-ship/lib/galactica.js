// @ts-check
const {Elf} = require('xcraft-core-goblin');
const {string} = require('xcraft-core-stones');
const {Ship} = require('goblin-space-battle/lib/ship.js');

class GalacticaShape {
  id = string;
  pilot = string;
}

class GalacticaState extends Elf.Sculpt(GalacticaShape) {}

class GalacticaLogic extends Elf.Spirit {
  state = new GalacticaState({
    id: 'galactica',
    pilot: 'starbuck',
  });
}

class Galactica extends Elf.Alone {
  logic = Elf.getLogic(GalacticaLogic);
  state = new GalacticaState();

  _desktopId = 'system@universe';

  async getPilot() {
    const {state} = this;
    return state.pilot;
  }

  /* =============================== S2.P1 =============================== */
  async start(shipId) {
    const ship = await new Ship(this).create(shipId, this._desktopId);
    let dest = 'celestial@moon';
    await ship.goto(dest);
  }

  /* =============================== S2.P1 =============================== */
  async tick(ship) {
    this.log.dbg('updated');
  }
}

module.exports = {Galactica, GalacticaLogic};
