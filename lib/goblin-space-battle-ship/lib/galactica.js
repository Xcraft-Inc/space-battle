// @ts-check
const {Elf} = require('xcraft-core-goblin');
const {string} = require('xcraft-core-stones');
const {
  ExoplanetLogic,
  ExoplanetShape,
} = require('goblin-space-battle/lib/exoplanet.js');
const {$create} = require('xcraft-core-goblin/lib/elf/index.js');

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

  async boot() {
    await this.queries();
  }

  /* =============================== PART 4 =============================== */
  async queries() {
    let results;
    const reader = await this.cryo.reader(ExoplanetLogic.db);

    this.log.dbg('Exoplanets discovered before 1997');

    results = reader
      .queryArchetype('exoplanet', ExoplanetShape)
      .fields(['name', 'discoveryYear'])
      .where((exo, $) => exo.get('discoveryYear').lte(1996))
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
  }
}

module.exports = {Galactica, GalacticaLogic};
