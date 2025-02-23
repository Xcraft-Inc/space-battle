/* =============================== S1.P1 =============================== */
const {Elf} = require('xcraft-core-goblin');
const {Architect} = require('./lib/architect.js');

exports.xcraftCommands = Elf.birth(Architect);
