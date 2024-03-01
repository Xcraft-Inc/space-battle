# Space Battle

La bataille spatiale est un projet d'exercices pour les Elfes du module
`xcraft-core-goblin`. Les exercices sont regroupés en deux parties.

## Documentations

- Le site principal d'Xcraft avec sa [documentation sur les Elfes][1]
- Le site du projet `xcraft-core-stones` et [sa documentation][2]
- Le site du projet `xcraft-core-pickaxe` et [ses exemples][3]

## Partie 1

Cette section contient 4 parties permettant de se familiariser avec les Elfes.
Ici vous allez entraîner :

1. La définition d'Elfes singleton
2. La définition d'Elfes d'instance
3. La définition de modèles de state (module `xcraft-core-stones`)
4. La différence entre un state `Spirit` et un state `Archetype`
5. Comment bootstrapper l'univers
6. Créer les planètes et les lunes
7. Créer les exoplanètes
8. Effectuer des recherches dans les exoplanètes (module `xcraft-core-pickaxe`)

### Section 1

Nous allons créer ensemble le singleton qui représente le vaisseau mère et qui
se nomme Galactica. Ce singleton sera nécessaire pour implémenter les `tick`s du
jeu de la Bataille Spatiale de la seconde partie.

> singleton, spirit, quest, stones

### Section 2

Maintenant que nous avons un vaisseau mère et l'univers, il manque les astres.
Il va falloir alors créer des planètes, des lunes et des exoplanètes. Cette
seconde partie concerne la création des objets célestes immédiats tels que les
planètes de notre système solaire ainsi que les lunes. Notez que notre univers
ne contiendra pas de soleil ni d'autres formes d'objets célestes.

> resource, defer, feed, smartId, create, stones

### Section 3

Nous allons commencer par créer l'Elfe qui va représenter une exoplanète.

Continuons la création, mais cette fois nous allons récupérer une source de
données distante. On va alors entraîner la création en masse et en streaming. Il
y a en effet beaucoup plus d'exoplanètes que de planètes et de lunes (dans notre
univers).

> instance, archetype, got, json, stream, insertOrReplace

### Section 4

Nous allons faire un tour rapide dans le client qui peut exploiter le serveur.
On va voir que le client fonctionne en local first, ce qui veut dire qu'il n'a
pas directement besoin du serveur pour fonctionner. On va utiliser le serveur
pour récupérer les datasets afin de ne pas être tout seul dans l'univers.

On va alors découvrir la synchronisation des Elfes, puis on va localement
pouvoir faire des recherches dans les exoplanètes.

> sync, query, pickaxe

## Partie 2

**Bienvenue dans le jeu de la Bataille Spatiale**

Des entités vont apparaîtres dans l'univers, se sont les vaisseaux (Ship).

C'est ici que le jeu commence. Le but est de créer un seul vaisseau par joueur.
Ce vaisseau va naviguer d'astres en astres (planètes et lunes uniquements), afin
de récupérer du minerais.

Règles du jeu :

0. Il est interdit de manipuler les vaisseaux des concurrents
1. Une partie dure exactement **une minute**
2. Chaque joueur programme ce que son vaisseau devra faire pendant la partie
   - Chercher des planètes à exploiter
   - Se déplacer sur ces planètes
   - Extraire du minerais
3. L'Helium-3 (He-3) est le seul minerais qui peut être utilisé comme carburant
4. Un vaisseau sans carburant ne peut plus faire de déplacement
5. La Terre n'a pas de ressource
6. Le gagnant est celui qui a extrait le plus de minerais en fin de partie

Le serveur va effectuer les événements suivants :

0. Démarrer la partie
1. Déduire le carburant utilisé par les vaisseaux
2. Avancer les vaisseaux (tout au plus) de 50 unités par seconde
3. Stopper la partie après une minute
4. Calculer le tableau des scores

### Fonctionnement

Quand le serveur démarre une partie, il va appeler le quête `tick` du Galactica,
avec un délai d'environ 2s par tick (approximatif).

---

Au tick, vous pouvez récupérer l'instance de votre vaisseau en utilisant un
identifiant réservé à cette effet. Le point de départ est la Terre. Ce qui veut
dire que les distances doivent se calculer relativement à la distance de la
Terre par rapport au soleil.

---

Lors d'un tick vous devez appeler la quête `goto` ou `collect` de votre
vaisseau. Dans le cas contraire, vous ne recevrez plus de tick jusqu'à la fin de
la partie. Il est inutile d'appeler plus d'un `goto` ou d'un `collect` par tick
(l'explication vient du mécanisme de synchronisation).

---

Si vous appelez un `collect` pendant le déplacement de votre vaisseau, vous
perdez un tour car il n'y a rien a collecter.

---

Vous ne pouvez pas collecter plus de 400 unités de chaque minerais par tour.

---

Si au prochain tick, `state.destination` n'est pas null, alors vous n'avez pas
encore atteint l'astre, dans ce cas vous devez appeler à nouveau la quête
`goto`. Vous avez le droit de changer d'objectif si vous estimez qu'un astre
plus proche deviendrait plus intéressant.

> Il est possible qu'un autre astre devienne plus intéressant dans le cas où
> d'autres joueurs auraient pris de l'avance sur vous et que l'astre cible
> serait pillé pendant votre voyage.

---

Pour avancer, votre vaisseau à besoin d'He-3. Voici le calcul qui permet de
connaître la distance qui peut être parcourue avec une certaine quantité d'He-3.

```
distance = He3 / 1.5
```

---

Les lunes sont à la même distance que la planète autour de laquelle elles
gravitent. De ce fait, ces voyages (au sein du même système planétaire)
donneraient des distances à parcourir de 0. Le serveur va (dans ce cas) imputer
d'office 10 de distance.

[1]: http://xcraft.ch/elves/
[2]: https://github.com/Xcraft-Inc/xcraft-core-stones/blob/master/README.md
[3]:
  https://github.com/Xcraft-Inc/xcraft-core-pickaxe/blob/master/lib/examples.js
