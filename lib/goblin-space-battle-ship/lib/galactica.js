// @ts-check
const {Elf} = require('xcraft-core-goblin');
const {string} = require('xcraft-core-stones');
const {
  ExoplanetLogic,
  ExoplanetShape,
} = require('goblin-space-battle/lib/exoplanet.js');
const {Ship, ShipLogic} = require('goblin-space-battle/lib/ship.js');

class GalacticaShape {
  id = string;
}

class GalacticaState extends Elf.Sculpt(GalacticaShape) {}

class GalacticaLogic extends Elf.Spirit {
  state = new GalacticaState({
    id: 'galactica',
  });
}

class Galactica extends Elf.Alone {
  logic = Elf.getLogic(GalacticaLogic);
  state = new GalacticaState();

  _shipId = 'ship@schroeter';
  _desktopId = 'system@universe';
  _unsub;

  async boot() {
    await this.queries();

    this.quest.sub('*::universe.started', async () => {
      const cryo = this.quest.getAPI('cryo');
      this._unsub = this.quest.sub(
        '*::<ship-updated>',
        async () => await this.tick()
      );
      await cryo.registerLastActionTriggers({
        actorType: 'ship',
        onInsertTopic: '<ship-updated>',
        onUpdateTopic: '<ship-updated>',
      });

      await this.start();
    });
  }

  /* =============================== S2.P1 =============================== */
  async start() {
    const ship = await new Ship(this).create(this._shipId, this._desktopId);
    let dest = 'celestial@moon';
    await ship.goto(dest);
  }

  /* =============================== S2.P1 =============================== */
  async tick() {
    this.cryo.getState(ShipLogic.db, this._shipId, 'persist');
    this.log.dbg('updated');
  }

  /* =============================== S1.P4 =============================== */
  async queries() {
    let results;
    const reader = await this.cryo.reader(ExoplanetLogic.db);

    this.log.dbg('Exoplanets discovered before 1997');

    results = reader
      .queryArchetype('exoplanet', ExoplanetShape)
      .fields(['name', 'discoveryYear'])
      .where((exo) => exo.get('discoveryYear').lte(1996))
      .iterate();
    for (const result of results) {
      this.log.dbg(`→ ${result.name} (${result.discoveryYear})`);
    }

    this.log.dbg('Exoplanets between 550 and 560 parsecs');

    results = reader
      .queryArchetype('exoplanet', ExoplanetShape)
      .fields(['name', 'distance'])
      .where((exo, $) =>
        $.and(exo.get('distance').gte(550), exo.get('distance').lte(560))
      )
      .iterate();
    for (const result of results) {
      this.log.dbg(`→ ${result.name} (${result.distance})`);
    }

    this.log.dbg('Exoplanets with mostly the same radius that the earth');

    results = reader
      .queryArchetype('exoplanet', ExoplanetShape)
      .fields(['name', 'radius'])
      .where((exo, $) =>
        $.and(exo.get('radius').lt(1.01), exo.get('radius').gt(0.99))
      )
      .orderBy((exo) => exo.get('radius'))
      .iterate();
    for (const result of results) {
      this.log.dbg(`→ ${result.name} (${result.radius})`);
    }
  }
}

module.exports = {Galactica, GalacticaLogic};
