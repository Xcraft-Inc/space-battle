const {Elf} = require('xcraft-core-goblin');
const {Galaxy, GalaxyLogic} = require('./lib/galaxy.js');

exports.xcraftCommands = Elf.birth(Galaxy, GalaxyLogic);
