// @ts-check
const {Elf} = require('xcraft-core-goblin');
const {string} = require('xcraft-core-stones');
const {Ship, ShipState} = require('goblin-space-battle/lib/ship.js');
const {
  CelestialLogic,
  CelestialShape,
} = require('goblin-space-battle/lib/celestial.js');

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

  async getPilot() {
    const {state} = this;
    return state.pilot;
  }

  /* =============================== S2.P1 =============================== */
  /** @param {ShipState} state */
  async tick(state) {
    const ship = await new Ship(this).api(state.id);

    /* Get current fuel */
    const fuel = state.goods['He-3'];

    /* Max possible distance with current fuel */
    const maxDistance = fuel / 1.5;

    /* List celestials */
    const reader = await this.cryo.reader(CelestialLogic.db);
    const results = reader
      .queryArchetype('celestial', CelestialShape)
      .fields(['id', 'type', 'distance', 'goods'])
      .where((celestial, $) =>
        $.and(
          celestial.get('distance').lt(maxDistance) /* Possible to join */,
          celestial
            .get('goods')
            .get('He-3')
            .gt(fuel / 2) /* With at laest half-fuel */
        )
      )
      .all()
      .sort((a, b) =>
        Object.keys(a.goods).length > Object.keys(b.goods).length ? -1 : 1
      );

    this.log.dbg(
      `goto ${results[0].id} tick:${state.tick} delta:${state.delta} fuel:${state.goods['He-3']}`
    );
    await ship.goto(results[0].id);
  }
}

module.exports = {Galactica, GalacticaLogic};
