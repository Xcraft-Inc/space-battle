const {Elf} = require('xcraft-core-goblin');
const {Galactica, GalacticaLogic} = require('./lib/galactica.js');

exports.xcraftCommands = Elf.birth(Galactica, GalacticaLogic);
