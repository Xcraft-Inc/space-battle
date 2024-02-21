# Space Battle

La bataille spatiale est un projet d'exercices pour les Elfes du module `xcraft-core-goblin`.
Les exercices sont regroupés en deux sections bien distincte.

## Section 1

Cette section contient 4 parties permettant de se familiariser avec les Elfes.
Ici vous allez entraîner :

1. La définition d'Elfes singleton
2. La définition d'Elfes d'instance
3. La définition de modèles de state (`xcraft-core-stones`)
4. La différence entre un state `Spirit` et un state `Archetype`
5. Comment bootstrapper l'univers
6. Créer les planètes et les lunes
7. Créer les exoplanètes
8. Effectuer des recherches dans les exoplanètes

### Partie 1

Nous allons créer ensemble le singleton qui représente l'univers. Ce singleton
sera utilisé par le serveur de la bataille spatiale. Le travail consistera à
définir le singleton et de préparer les quêtes pour les parties 2 et 3 de
cette section.

> singleton, spirit, bootstrap, quest, stones

### Partie 2

Maintenant que nous avons un univers, il est malheureusement encore vide.
Il va falloir alors créer des planètes, des lunes et des exoplanètes.
Cette seconde partie concerne la création des objets célestes immédiats
tels que les planètes de notre système solaire ainsi que les lunes. Notez
que notre univers ne contiendra pas de soleil ni d'autres formes d'objets
célestes.

> instance, archetype, resource, defer, feed, smartId, create, stones

### Partie 3

Continuons la création, mais cette fois nous allons récupérer une source de
données distante. On va alors entraîner la création en masse et en streaming.
Il y a en effet beaucoup plus d'exoplanètes que de planètes et de lunes (dans
notre univers).

> got, json, stream, insertOrReplace

### Partie 4

Nous allons faire un tour rapide dans le client qui peut exploiter le serveur.
On va voir que le client fonctionne en local first, ce qui veut dire qu'il
n'a pas directement besoin du serveur pour fonctionner. Néanmoins, sans le
serveur, on risque de se sentir un peu seul.

On va alors découvrir la synchronisation des Elfes, puis on va localement
pouvoir faire des recherches dans les exoplanètes.

> sync, query, pickaxe

## Section 2

Des entités vont apparaîtres spontanément dans l'univers, se sont les vaisseaux (Ship).
Il va y avoir de types de vaisseaux. Les vrais pilotes (vous) mais aussi des pirates.
