'use strict';

module.exports = [
  {
    type: 'input',
    name: 'celestial.goodsPlanet',
    message: 'Goods base multiplier for planet',
    default: 1000,
  },
  {
    type: 'input',
    name: 'celestial.goodsMoon',
    message: 'Goods base multiplier for moon',
    default: 100,
  },
  {
    type: 'input',
    name: 'celestial.collectQty',
    message: 'Collect quantity by turn',
    default: 400,
  },
  {
    type: 'input',
    name: 'celestial.distanceFar',
    message: "Distance limit when it's far (more goods)",
    default: 400,
  },
  {
    type: 'input',
    name: 'celestial.distanceFarMul',
    message: 'Multiplier for goods with far celestials',
    default: 3,
  },
  {
    type: 'input',
    name: 'ship.fuelInitial',
    message: 'Quantity of fuel when starting a game',
    default: 1000,
  },
  {
    type: 'input',
    name: 'ship.fuelFactor',
    message: 'distance = fuel / fuelFactor',
    default: 1.5,
  },
  {
    type: 'input',
    name: 'ship.distanceMin',
    message: 'Minimal distance for a goto',
    default: 10,
  },
  {
    type: 'input',
    name: 'ship.distanceMax',
    message: 'Maximal distance for a goto',
    default: 100,
  },
];
