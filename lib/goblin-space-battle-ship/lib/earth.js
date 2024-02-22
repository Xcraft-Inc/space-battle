// @ts-check
const {Elf} = require('xcraft-core-goblin');
const {string} = require('xcraft-core-stones');
const {ShipState, Ship} = require('goblin-space-battle/lib/ship.js');
const {Galactica} = require('./galactica.js');
const {
  ExoplanetLogic,
  ExoplanetShape,
} = require('goblin-space-battle/lib/exoplanet.js');

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

  desktopId = 'system@universe';
  unsub;
  ship;

  async boot() {
    await this.queries();

    this.quest.sub('*::universe.started', async () => {
      const galactica = await new Galactica(this);

      const pilot = await galactica.getPilot();
      const shipId = `ship@${pilot.toLowerCase()}`;
      this.ship = await new Ship(this).create(shipId, this.desktopId);

      this.unsub = this.quest.sub(
        `*::warehouse.<${this.desktopId}>.changed`,
        async () => {
          const data = await this.quest.warehouse.get({path: shipId});
          const state = Elf.Spirit.from(ShipState)(data);
          if (state.server === true) {
            await galactica.tick(state);
          }
        }
      );
      await this.quest.warehouse.subscribe({
        feed: this.desktopId,
        branches: [shipId],
      });

      /*
      const cryo = this.quest.getAPI('cryo');
      this._unsub = this.quest.sub('*::<ship-updated>', async () => {
        const ship = await this.cryo.getState(ShipLogic.db, shipdId, 'persist');
        if (ship.server) {
          await galactica.tick(ship);
        }
      });
      await cryo.registerLastActionTriggers({
        actorType: 'ship',
        onInsertTopic: '<ship-updated>',
        onUpdateTopic: '<ship-updated>',
      });
      */
    });
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

module.exports = {Earth, EarthLogic};
