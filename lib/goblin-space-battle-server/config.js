'use strict';

module.exports = [
  {
    type: 'input',
    name: 'chronomancer.startTime',
    message: '3min   [3:00, 6:00, ...]',
    default: '0 */3 * * * *',
  },
  {
    type: 'input',
    name: 'chronomancer.resetTime',
    message: '3min30 [2:30, 5:30, ...]',
    default: '30 2/3 * * * *',
  },
  {
    type: 'input',
    name: 'chronomancer.ticksTime',
    message: '2s     [0:02, 0:04, ...]',
    default: '*/2 * * * * *',
  },
];
