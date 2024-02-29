# Annotations de types avec JSDoc

_Sources :_
[JSDoc - Wikipedia](https://fr.wikipedia.org/wiki/JSDoc) |
[JSDoc](https://jsdoc.app) |
[JS Reference - MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference) |
[TS documentation](https://www.typescriptlang.org/docs/handbook/jsdoc-supported-types.html)

JSDoc est un langage de balisage utilisé pour documenter les codes sources JavaScript. En utilisant des commentaires qui contiennent des tags JSDoc, on peut documenter et indiquer le type des fonctions, classes et variables d'un programme. La syntaxe de JSDoc est similaire à celle de Javadoc.

Quelques tags et leur utilisation habituelle pour l'annotation des types :

| Tag         | Description                                                   |
| ----------- | ------------------------------------------------------------- |
| @param      | Documente un paramètre d'une fonction                         |
| @return     | Documente le retour d'une fonction                            |
| @type       | Défini le type d'une variable                                 |
| @typedef    | Crée un type personnalisé                                     |
| @template   | Défini un paramètre de type générique                         |
| @extends    | Défini le type de la classe de base lorsqu'elle est générique |
| @deprecated | Marque une méthode obsolète                                   |
| @private    | Signifie qu'un membre est privé                               |
| @protected  | Signifie qu'un membre est "protected"                         |

## Exemples

Les commentaires JS se font avec `//` ou `/* ... */`.
Pour JSdoc, on utilise `/** ... */`.

### Fonctions

```js
/**
 * @param {string} name
 */
function sayHello(name) {
  console.log(`Hello ${name}!`);
}

/**
 * @param {number} num1
 * @param {number} num2
 * @returns {number}
 */
function add(num1, num2) {
  return num1 + num2;
}
```

### Variable

```js
/** @type {string} */
let name;

/** @type {string[]} */
let mails;
```

### Définir un type

```js
/**
 * @typedef {{name: string, age: number}} User
 */
```

Utilisation du type défini

```js
/**
 * @param {User} user
 */
function sayHello(user) {
  console.log(`Hello ${user.name}!`);
}
```

## Utilité des annotations

Pourquoi utiliser ces annotations ?\
Elles permettent d'améliorer le confort de développement dans VSCodium / VSCode.

- Ça ajoute de l'autocomplétion des propriétés et des méthodes.
- Ça affiche des erreurs quand un mauvais type est utilisé.
- Les commentaires JSDoc permettent de documenter le code si on le souhaite.

Ce que les annotations ne permettent pas :

- Faire des vérifications de type à l'exécution du programme.

Une autre manière de typer le code JS est d'écrire son code en TypeScript.
Mais ça n'est plus du JS valide et il faut passer par une phase de compilation. Le TypeScript ne permet pas non plus de faire des vérifications au runtime.

Pour avoir des vérifications statiques et dynamiques, voir [xcraft-core-stones](https://github.com/Xcraft-Inc/xcraft-core-stones). Ce projet permet de définir des schémas de données en JS, de vérifier qu'une variable correspond à un schéma, ainsi que de dériver des types TypeScript utilisables dans les annotations JSDoc.

## Les types

Pour les annotations de type, on peut utiliser tous les types JS, ainsi que les types définis dans TypeScript.

### Les types de base

| Type      | Exemple       |
| --------- | ------------- |
| boolean   | true \| false |
| string    | 'abc'         |
| number    | 42            |
| null      | null          |
| undefined | undefined     |

| Type    | Info                                          |
| ------- | --------------------------------------------- |
| any     | N'import quel type                            |
| never   | Représente une valeur qui ne peut pas arriver |
| unknown | Valeur dont on ne connait pas le type         |

### Tableaux

`T[]` avec `T` qui peut être n'importe quel type.\
Exemples de types : `any[]`, `string[]`, `number[]`

Exemples de valeurs :

```js
[1, 2, 3];
['a', 'b', 'c'];
```

### Objets

| Type                           | Info                  |
| ------------------------------ | --------------------- |
| `{}`                           | N'importe quel objet  |
| `{name: string, age: number}`  | Avec des propriétés   |
| `{name: string, age?: number}` | Propriété optionnelle |

Exemple de valeur :

```js
{name: 'Toto', age: 12}
```

### Records

On peut définir des objets avec des clés quelconques.

`{[key: K]: V}` ou `Record<K,V>`

- Avec `K` qui dérive de `string | number | symbol`.
- Avec `V` qui peut être n'importe quel type.
- Exemple de type : `Record<string, number>`
- Exemple de valeur :

```js
{toto: 12, tata: 11}
```

### Fonctions

| Type                      | Info                                    |
| ------------------------- | --------------------------------------- |
| `Function`                | avec des arguments et retour quelconque |
| `() => void`              | sans argument ni valeur de retour       |
| `(string) => number`      |                                         |
| `(...args: any[]) => any` | fonction quelconque, comme `Function`   |

Exemples de valeur :

```js
() => {};

(name) => name.length;

function test(name) {
  return name.length;
}
```

### Union

L'union de deux types. Soit l'un, soit l'autre.\
`A | B`

Exemple de type : `string | number`

### Intersection

L'intersection de deux types. L'un et l'autre.\
`A & B`

Exemple de type : `{name: string} & {age: number}`

### Autre types JS

| Type      | Exemple                |
| --------- | ---------------------- |
| bigint    | 9007199254740991n;     |
| symbol    | Symbol("foo")          |
| Date      | new Date()             |
| Error     | new Error("Bad value") |
| RegExp    | /\d+/                  |
| Map\<K,V> | new Map()              |
| Set\<T>   | new Set()              |

### Types utilitaires TS

| Type             | Info                                                 |
| ---------------- | ---------------------------------------------------- |
| Partial\<T>      | Rend optionnel toutes les propriétés de l'objet      |
| Pick\<T,K>       | Objet T avec seulement les propriétés listées dans K |
| Omit\<T,K>       | Contraire de Pick, exclu les propriétés              |
| Parameters\<T>   | Récupère les paramètres d'une fonction               |
| ReturnType\<T>   | Récupère le type de retour d'une fonction            |
| InstanceType\<T> | Retourne le type d'instance d'un constructeur        |
| Uppercase<T>     | Converti un type string literal en majuscule         |
| Capitalize<T>    | Converti le premier caractère en majuscule           |
| etc...           |                                                      |

Pour voir d'autres types, faire `F12` ou `ctrl+click` sur un de ces types.

## Classes

Exemple de classe avec annotations.

```js
class User {
  name; // Type déterminé automatiquement selon le constructeur
  age;

  /**
   * @param {string} name
   * @param {number} age
   */
  constructor(name, age) {
    this.name = name;
    this.age = age;
  }

  /**
   * @param {this["name"]} name // Référence au type de this.name
   */
  setName(name) {
    this.name = name;
  }

  // Type de retour déterminé automatiquement
  getAge() {
    return this.age;
  }
}
```

## Types génériques

Définir un type générique avec `@typedef`.

```js
/**
 * @template T
 * @typedef {{value: T | null}} MayBeValue
 */

/** @type {MayBeValue<string>} */
let maybe = {value: 'Toto'};
```

Définir une fonction générique.

```js
/**
 * @template T
 * @param {T | null} value
 * @returns {T}
 */
function valueOrThrow(value) {
  if (value === null) {
    throw new Error('Value is null');
  }
  return value;
}

let test = valueOrThrow(maybe.value);

maybe.value; // type: string | null
test; // type: string
```
