const {Elf} = require('xcraft-core-goblin');
const {Exoplanet, ExoplanetLogic} = require('./lib/exoplanet.js');

exports.xcraftCommands = Elf.birth(Exoplanet, ExoplanetLogic);
