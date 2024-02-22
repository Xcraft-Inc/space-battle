// @ts-check
const {Elf} = require('xcraft-core-goblin');
const {string} = require('xcraft-core-stones');
const {Ship, ShipState} = require('goblin-space-battle/lib/ship.js');

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

  desktopId = 'system@universe';
  ship;

  async getPilot() {
    const {state} = this;
    return state.pilot;
  }

  /* =============================== S2.P1 =============================== */
  async start(shipId) {
    this.ship = await new Ship(this).create(shipId, this.desktopId);
    let dest = 'celestial@mars';

    const data = await this.quest.warehouse.get({path: this.ship.id});
    this.log.dbg('init', data.toJS());

    await this.ship.goto(dest);
  }

  /* =============================== S2.P1 =============================== */
  /**
   * @param {ShipState} state
   */
  async tick(state) {
    this.log.dbg('updated', state.toJS());
  }
}

module.exports = {Galactica, GalacticaLogic};
