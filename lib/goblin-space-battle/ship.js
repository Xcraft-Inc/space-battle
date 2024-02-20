const {Elf} = require('xcraft-core-goblin');
const {Ship, ShipLogic} = require('./lib/ship.js');

exports.xcraftCommands = Elf.birth(Ship, ShipLogic);
