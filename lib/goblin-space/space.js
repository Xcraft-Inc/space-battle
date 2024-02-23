const {Elf} = require('xcraft-core-goblin');
const {Space, SpaceLogic} = require('./lib/space.js');

exports.xcraftCommands = Elf.birth(Space, SpaceLogic);
