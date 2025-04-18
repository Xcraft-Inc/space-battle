// @ts-check
const {Elf, SmartId} = require('xcraft-core-goblin');
const {locks} = require('xcraft-core-utils');
const {string} = require('xcraft-core-stones');
const {
  ShipState,
  Ship,
  ShipLogic,
  ShipShape,
} = require('goblin-space-battle/lib/ship.js');
const {Galactica} = require('./galactica.js');

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

  _desktopId = 'system@universe';
  _tick = -1;
  /** @type {Ship} */ _ship;
  _mutex = locks.getMutex;

  async boot() {
    const cryo = this.quest.getAPI('cryo');
    const galactica = await new Galactica(this);
    const pilot = await galactica.getPilot();
    const shipId = SmartId.from('ship', pilot);
    const actionId = `ship-${shipId}`;

    if (galactica.preload) {
      await galactica.preload();
    }

    if (!galactica.tick) {
      return;
    }

    this.quest.sub('*::<ship-updated>', async (_, {msg}) => {
      if (msg?.data !== actionId) {
        return;
      }
      try {
        await this._mutex.lock(shipId);
        const data = await this.cryo.getState(ShipLogic.db, shipId, ShipShape);
        const state = new ShipState(data);
        if (state.server > 0 && state.tick !== this._tick) {
          this._tick = state.tick;
          await galactica.tick(state);
        }
      } finally {
        this._mutex.unlock(shipId);
      }
    });

    await cryo.registerLastActionTriggers({
      actorType: 'ship',
      onInsertTopic: '<ship-updated>',
      onUpdateTopic: '<ship-updated>',
    });

    this.quest.sub('*::universe.started', async () => {
      if (this._ship) {
        const data = await this.cryo.getState(ShipLogic.db, shipId, ShipShape);
        const state = new ShipState(data);
        await galactica.tick(state);
      }
    });

    this.quest.sub('*::universe.reseted', async () => {
      this._ship = await new Ship(this).create(shipId, this._desktopId);
      await this._ship.reset();
    });
  }
}

module.exports = {Earth, EarthLogic};
