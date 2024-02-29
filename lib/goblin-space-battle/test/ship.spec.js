'use strict';

if (!process.env.XCRAFT_ROOT) {
  const fs = require('fs');
  const xHost = require('xcraft-core-host');
  process.env.XCRAFT_ROOT = fs.existsSync(xHost.appConfigPath)
    ? xHost.appConfigPath
    : xHost.projectPath;
}

const {expect} = require('chai');

describe('goblin.space-battle.ship', function () {
  const {ShipLogic} = require('../lib/ship.js');

  it('goto', function () {
    const shipLogic = new ShipLogic();
    shipLogic.create('ship@test');

    shipLogic.goto('celestial@moon');

    expect(shipLogic.state.destination).to.be.equal('celestial@moon');
    expect(shipLogic.state.server).to.be.equal(0);
  });

  it('goto:update', function () {
    const shipLogic = new ShipLogic();
    shipLogic.create('ship@test');

    shipLogic.goto('celestial@moon');
    shipLogic.beforePersistOnServer(0, 200, 324, {'He-3': 666}, {});

    expect(shipLogic.state.server).to.be.equal(0);
    expect(shipLogic.state.goods['He-3']).to.be.equal(666 - 100 * 1.5); // 591
    expect(shipLogic.state.delta).to.be.equal(100);
    expect(shipLogic.state.position).to.be.equal('celestial@earth');

    shipLogic.beforePersistOnServer(1, 200, 324, {'He-3': 591}, {});

    expect(shipLogic.state.goods['He-3']).to.be.equal(591 - 24 * 1.5);
    expect(shipLogic.state.delta).to.be.equal(0);
    expect(shipLogic.state.destination).to.be.null;
    expect(shipLogic.state.position).to.be.equal('celestial@moon');
  });

  it('collect', function () {
    const shipLogic = new ShipLogic();
    shipLogic.create('ship@test');

    shipLogic.collect();

    expect(shipLogic.state.collect).to.be.true;
    expect(shipLogic.state.server).to.be.equal(0);
  });

  it('collect:update', function () {
    const shipLogic = new ShipLogic();
    shipLogic.create('ship@test');

    shipLogic.collect();
    shipLogic.beforePersistOnServer(0, 0, 0, {}, {'Fe': 400, 'He-3': 250});

    expect(shipLogic.state.server).to.be.equal(0);
    expect(shipLogic.state.goods.Fe).to.be.equal(400);
    expect(shipLogic.state.goods['He-3']).to.be.equal(1250);
  });
});
