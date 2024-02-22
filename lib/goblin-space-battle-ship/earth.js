const {Elf} = require('xcraft-core-goblin');
const {Earth, EarthLogic} = require('./lib/earth.js');

exports.xcraftCommands = Elf.birth(Earth, EarthLogic);
