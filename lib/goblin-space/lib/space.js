// @ts-check
const {ShipLogic, ShipShape} = require('goblin-space-battle/lib/ship.js');
const {Elf} = require('xcraft-core-goblin');
const {string, array} = require('xcraft-core-stones');

class SpaceShape {
  id = string;
  ships = array(string);
}

class SpaceState extends Elf.Sculpt(SpaceShape) {}

class SpaceLogic extends Elf.Spirit {
  state = new SpaceState({
    id: 'space',
    ships: [],
  });

  configureDesktop(ships) {
    const {state} = this;
    state.ships = ships;
  }
}

class Space extends Elf.Alone {
  logic = Elf.getLogic(SpaceLogic);

  labId;
  clientSessionId;
  desktopId;

  async boot() {}

  async configureDesktop(desktopId, clientSessionId, labId) {
    this.labId = labId;
    this.clientSessionId = clientSessionId;
    this.desktopId = desktopId;

    const reader = await this.cryo.reader(ShipLogic.db);
    const ships = reader.queryArchetype('ship', ShipShape).field('id').all();
    this.logic.configureDesktop(ships);

    await this.quest.warehouse.subscribe({
      feed: this.desktopId,
      branches: ships,
    });

    return {
      rootWidget: 'space-root',
      rootWidgetId: desktopId,
      defaultTheme: 'default',
      themeContext: 'space',
    };
  }
}

module.exports = {Space, SpaceLogic};
