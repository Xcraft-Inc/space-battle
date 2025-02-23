'use strict';

const {expect} = require('chai');
const {Elf} = require('xcraft-core-goblin/lib/test.js');

describe('goblin.space-battle.ship', function () {
  const {ShipLogic} = require('../lib/ship.js');

  it('goto', function () {
    const shipLogic = Elf.trial(ShipLogic);
    shipLogic.create('ship@test');

    shipLogic.goto('celestial@Moon');

    expect(shipLogic.state.destination).to.be.equal('celestial@Moon');
    expect(shipLogic.state.server).to.be.equal(0);
  });

  it('goto:update', function () {
    const shipLogic = Elf.trial(ShipLogic);
    shipLogic.create('ship@test');

    shipLogic.goto('celestial@Moon');
    shipLogic.beforePersistOnServer(0, 200, 324, {'He-3': 666}, {});

    expect(shipLogic.state.server).to.be.equal(0);
    expect(shipLogic.state.goods['He-3']).to.be.equal(666 - 100 * 1.5); // 591
    expect(shipLogic.state.delta).to.be.equal(100);
    expect(shipLogic.state.position).to.be.equal('celestial@Earth');

    shipLogic.beforePersistOnServer(1, 200, 324, {'He-3': 591}, {});

    expect(shipLogic.state.goods['He-3']).to.be.equal(591 - 24 * 1.5);
    expect(shipLogic.state.delta).to.be.equal(0);
    expect(shipLogic.state.destination).to.be.null;
    expect(shipLogic.state.position).to.be.equal('celestial@Moon');
  });

  it('collect', function () {
    const shipLogic = Elf.trial(ShipLogic);
    shipLogic.create('ship@test');

    shipLogic.collect();

    expect(shipLogic.state.collect).to.be.true;
    expect(shipLogic.state.server).to.be.equal(0);
  });

  it('collect:update', function () {
    const shipLogic = Elf.trial(ShipLogic);
    shipLogic.create('ship@test');

    shipLogic.collect();
    shipLogic.beforePersistOnServer(0, 0, 0, {}, {'Fe': 400, 'He-3': 250});

    expect(shipLogic.state.server).to.be.equal(0);
    expect(shipLogic.state.goods.Fe).to.be.equal(400);
    expect(shipLogic.state.goods['He-3']).to.be.equal(1250);
  });
});
