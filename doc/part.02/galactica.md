# Space Battle

## Ajouter la méthode pour les ticks

```js
class Galactica extends Elf.Alone {
  /** @param {t<ShipShape>} state */
  async tick(state) {}
}
```

## Accéder au vaisseau

```js
class Galactica extends Elf.Alone {
  /** @param {t<ShipShape>} state */
  async tick(state) {
    const ship = await new Ship(this).api(state.id);
  }
}
```

## Dire au vaisseau de se diriger sur un astre

```js
class Galactica extends Elf.Alone {
  /** @param {t<ShipShape>} state */
  async tick(state) {
    const ship = await new Ship(this).api(state.id);

    await ship.goto('celestial@Moon');
  }
}
```

## Expliquer le shape du vaisseau

```js
class ShipShape {
  id = id('ship');
  meta = MetaShape;

  position = id('celestial');
  destination = option(id('celestial'));
  goods = record(Element, number);
  delta = number;
  distance = number;

  collect = boolean;
  server = number;
  tick = number;
}
```

## Vérifier si le vaisseau est sur cet astre, si c'est le cas, collecter

```js
class Galactica extends Elf.Alone {
  /** @param {t<ShipShape>} state */
  async tick(state) {
    const ship = await new Ship(this).api(state.id);

    if (state.position === 'celestial@Moon') {
      await ship.collect();
    } else {
      await ship.goto('celestial@Moon');
    }
  }
}
```

## Désolé, pas eu le temps de mettre en place goblin-tests pour les Elfes

Il faudra vous contenter du `galactica.preload` et de modifier les cronjobs dans
`universe.js`.
