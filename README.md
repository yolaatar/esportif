# EsportIF

Une application web front-end permettant d'explorer l'univers de l'esport grâce à des données issues du web sémantique. Développée avec React et alimentée par des requêtes SPARQL sur DBpedia.

---

## Fonctionnalités

## Fonctionnalités

- **Navigation intuitive :** Parcourez les différentes sections principales : 
  - **À propos** : Présentation du projet.
  - **Jeux** : Découvrez les jeux vidéo les plus populaires dans l'esport.
  - **Tournois** : Explorez les tournois emblématiques.
  - **Équipes** : Apprenez-en davantage sur les équipes d'esport renommées.

- **Recherche rapide :** Une barre de recherche intégrée permet aux utilisateurs de rechercher des jeux, tournois ou équipes spécifiques. Les résultats sont filtrés en temps réel pour une expérience utilisateur fluide.

- **Affichage dynamique des données :** 
  - Les résultats des requêtes SPARQL sont affichés sous forme de listes ou de grilles pour une meilleure lisibilité.
  - Données issues directement de DBpedia, mises à jour en temps réel.

- **Optimisation des images via cache :** 
  - Un système de cache pour les images est utilisé afin de les charger une seule fois. 
  - Les images sont ensuite stockées en cache, réduisant ainsi le temps de chargement lors des visites suivantes et améliorant l'expérience utilisateur.

---

## Installation

Suivez ces étapes pour installer et exécuter l'application localement :

1. **Pré-requis :**
   - Avoir [Node.js](https://nodejs.org/) installé (version recommandée : 16 ou supérieure).
   - React est nécessaire pour exécuter le projet. Si vous ne l'avez pas encore configuré, installez-le via Node.js.

2. **Installer les dépendances :**
   Naviguez dans le répertoire du projet et exécutez :
   ```bash
   npm install
   ```
3. **Lancer l'application :**
   Une fois les dépendances installées, démarrez l'application avec :
   ```bash
   npm start
   ```
## Structure des fichiers

**App.js :**
  Point d'entrée principal, coordonne la navigation entre les pages.

**utils/dbpediaqueries.js :**
  Contient toutes les requêtes SPARQL nécessaires pour interroger DBpedia.

**pages/ :** Répertoire contenant les différentes pages (À propos, Jeux, Tournois, Équipes).

## Technologies utilisées
**React.js :**
  Pour une interface utilisateur dynamique et modulable.

**Tailwind CSS :**
  Gestion des styles réactifs.

**SPARQL et DBpedia :**
  Récupération des données sémantiques.

**Axios :** 
  Envoi des requêtes HTTP pour interroger l'endpoint SPARQL.

**Local Storage :** 
  Utilisé pour le cache des images, garantissant des temps de chargement réduits.
