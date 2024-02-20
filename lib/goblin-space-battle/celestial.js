const {Elf} = require('xcraft-core-goblin');
const {Celestial, CelestialLogic} = require('./lib/celestial.js');

exports.xcraftCommands = Elf.birth(Celestial, CelestialLogic);
