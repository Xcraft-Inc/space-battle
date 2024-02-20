'use strict';

const path = require('path');
const {modules} = require('xcraft-core-utils');

const [appId, variantId] = (process.env.GOBLINS_APP || 'squad').split('@');

module.exports = {
  default: modules.extractForEtc(path.join(__dirname, 'app'), appId, variantId),
};
