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
    const reader = await this.cryo.reader(CelestialLogic.db);
    const ship = await new Ship(this).api(state.id);

    /* Check where we are and if there are resources to collect */
    if (!state.destination) {
      const goods = reader
        .queryArchetype('celestial', CelestialShape)
        .field('goods')
        .where((celestial) => celestial.get('id').eq(state.position))
        .get();
      if (goods && Object.values(goods).some((element) => element > 0)) {
        await ship.collect(Object.keys(goods));
        return;
      }
    } else if (state.destination) {
      /* Continue with the actual destination */
      await ship.goto(state.destination);
      return;
    }

    /* Get current fuel */
    const fuel = state.goods['He-3'];

    /* Max possible distance with current fuel */
    let maxDistance = fuel / 1.5;

    const shipPos = reader
      .queryArchetype('celestial', CelestialShape)
      .field('distance')
      .where((celestial) => celestial.get('id').eq(state.position))
      .get();
    if (shipPos) {
      maxDistance -= shipPos;
    }

    /* Search celestials */
    let results = [];
    for (let i = 10; i >= 5 && !results?.length; ++i) {
      const He3 = 10 * i;
      results = reader
        .queryArchetype('celestial', CelestialShape)
        .fields(['id', 'type', 'distance', 'goods'])
        .where((celestial, $) =>
          $.and(
            celestial.get('distance').lt(maxDistance) /* Possible to join */,
            celestial.get('goods').get('He-3').gt(He3) /* With a bit of fuel */
          )
        )
        .all()
        .sort((a, b) =>
          Object.keys(a.goods).length > Object.keys(b.goods).length ? -1 : 1
        );
    }

    if (results?.length) {
      await ship.goto(results[0].id);
    }
  }
}

module.exports = {Galactica, GalacticaLogic};
