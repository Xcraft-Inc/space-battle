/* =============================== S1.P1 =============================== */
const {Elf} = require('xcraft-core-goblin');
const {Universe, UniverseLogic} = require('./lib/universe.js');

exports.xcraftCommands = Elf.birth(Universe, UniverseLogic);
