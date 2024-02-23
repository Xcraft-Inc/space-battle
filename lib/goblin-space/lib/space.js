// @ts-check
const {ShipLogic, ShipShape} = require('goblin-space-battle/lib/ship.js');
const {Elf} = require('xcraft-core-goblin');
const {string} = require('xcraft-core-stones');

class SpaceShape {
  id = string;
}

class SpaceState extends Elf.Sculpt(SpaceShape) {}

class SpaceLogic extends Elf.Spirit {
  state = new SpaceState({
    id: 'space',
  });
}

class Space extends Elf.Alone {
  labId;
  clientSessionId;
  desktopId;

  async boot() {}

  async configureDesktop(desktopId, clientSessionId, labId) {
    this.labId = labId;
    this.clientSessionId = clientSessionId;
    this.desktopId = desktopId;

    await this.quest.warehouse.subscribe({
      feed: this.desktopId,
      branches: ['universe'],
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
