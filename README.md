# Discord Community Bot

Un bot Discord orienté gestion de communauté, avec gestion des rôles, permissions, modération et commandes utilisateurs. Ce dépôt contient le code TypeScript, la configuration et des scripts pour développer, tester et build le bot.

---

## Table des matières

- **Présentation**: Bref aperçu du projet
- **Fonctionnalités**: Liste des fonctionnalités principales
- **Structure du projet**: Organisation des fichiers
- **Prérequis**: Logiciels et versions requises
- **Installation**: Instructions pour cloner et installer
- **Configuration**: Variables d'environnement et fichiers à configurer
- **Scripts NPM**: Commandes utiles pour développement et production
- **Architecture & Principes**: Description des composants principaux
- **Développement**: Guide rapide pour contribuer et ajouter des commandes
- **Tests**: Comment exécuter et ajouter des tests
- **Déploiement**: Conseils pour déployer le bot en production
- **FAQ & Dépannage**: Problèmes communs et solutions
- **Licence**: Informations de licence

---

## Présentation

Ce projet est un bot Discord écrit en TypeScript conçu pour aider à la modération et la gestion d'une communauté. Il inclut des modules pour gérer les rôles, permissions, journalisation, sauvegardes, et commandes slash.

Le point d'entrée du projet est `src/index.ts` et le code est transpilé avec TypeScript (`tsc`) vers `dist/` pour l'exécution en production.

## Fonctionnalités

- Gestion des rôles (ajout/suppression)
- Système de permissions et niveaux
- Modération: avertissement, timeout, mute
- Enregistrement et restauration de sauvegardes
- Commandes utilisateurs pour afficher des informations
- Intégration avec `discord.js` v14

## Structure du projet

- `src/` : Code source TypeScript
  - `commands/` : Implémentation des commandes (admin, moderator, user)
  - `events/` : Gestionnaires d'événements Discord (`ready`, `messageCreate`, `guildMemberAdd`, ...)
  - `services/` : Services réutilisables (channel, role, base de données locale)
  - `handlers/` : Logique pour dispatcher les commandes et permissions
  - `config/` : Configuration centrale
  - `data/` : Données locales (ex: `database.json`)
  - `utils/` : Utilitaires (logger, helpers)
- `tests/` : Tests unitaires (Jest)
- `polyfill.js` : Polyfill requis pour certaines versions de Node/discord.js
- `package.json` : Scripts et dépendances
- `tsconfig.json` : Configuration TypeScript

## Prérequis

- Node.js 18+ (recommandé pour `discord.js` v14)
- npm 9+ ou yarn
- Un compte Discord et un bot Token
- (Optionnel) Docker pour containeriser le bot

## Installation

1. Clonez le dépôt:

```powershell
git clone https://github.com/miro-fr/discord-community-bot.git
cd discord-community-bot
```

2. Installez les dépendances:

```powershell
npm install
```

3. Copiez et configurez les variables d'environnement (ex: `.env`):

```powershell
cp .env.example .env
# Modifier .env avec votre TOKEN et autres variables
```

Remarque: Si le projet n'inclut pas de `.env.example`, créez un fichier `.env` à la racine avec au minimum:

```
DISCORD_TOKEN=votre_token_ici
NODE_ENV=development
```

## Configuration

La configuration principale se trouve dans `src/config/index.ts`. Les variables communes incluent:

- `DISCORD_TOKEN` : Le token de l'application/bot
- `PREFIX` : Préfixe des commandes (si utilisé)
- `OWNER_ID` : ID du propriétaire pour commandes restreintes

Assurez-vous que `src/data/database.json` ou toute base locale est lisible et a des permissions en écriture pour le processus.

## Scripts utiles

- `npm run start:dev` : Démarrage en développement (utilise `ts-node`)
- `npm run build` : Transpile TypeScript vers JavaScript dans `dist/`
- `npm run start` : Démarre le binaire construit (`dist/index.js`)
- `npm test` : Exécute la suite de tests Jest

Exemples:

```powershell
npm run start:dev
npm run build; npm run start
npm test
```

## Architecture & Principes

Le bot est organisé de façon modulaire:

- Événements: Les fichiers dans `src/events/` enregistrent les callbacks pour les événements Discord et délèguent la logique aux services/handlers.
- Commands: Chaque commande est un module séparé dans `src/commands/` et exporte la logique d'exécution et les métadonnées (permissions, options).
- Services: Composants réutilisables (p.ex. `roleService`, `channelService`) exposent des fonctions haut niveau pour manipuler l'API Discord et encapsuler les détails.
- Storage: Le projet utilise un stockage local JSON (`src/data/database.json`) via `services/localDatabase.ts`. Pour production, il est recommandé de remplacer par une vraie base (SQLite, Postgres, MongoDB).

Principes importants:

- Validation centralisée des permissions dans `handlers/permissionHandler.ts`.
- Journalisation cohérente via `utils/logger.ts`.
- Sauvegardes régulières disponibles dans `src/backup/backupManager.ts`.

## Développement

Pour ajouter une nouvelle commande:

1. Créez un fichier dans `src/commands/<role>/` (ex: `src/commands/admin/maCommande.ts`).
2. Exportez un objet avec `name`, `description`, `execute(interaction)` et éventuellement `permissions`.
3. Enregistrez la commande si nécessaire via `slashRegistrar.ts`.

Bonnes pratiques:

- Respectez la typage TypeScript et ajoutez des types dans `src/types/` si besoin.
- Testez localement avec `npm run start:dev` dans un serveur de test.
- Documentez chaque commande et ses permissions dans le code.

## Tests

Le projet utilise Jest pour les tests unitaires. Un exemple de test se trouve dans `tests/commands/addRole.test.ts`.

Lancer les tests:

```powershell
npm test
```

Ajouter des tests:

1. Placez les tests sous `tests/` en respectant la convention `.test.ts`.
2. Mockez les objets Discord quand nécessaire (ex: `Client`, `Guild`, `Role`).

## Déploiement

Conseils pour la mise en production:

- Utilisez un process manager (p.ex. `pm2`) pour garder le bot en ligne et gérer les redémarrages.
- Mettez en place des variables d'environnement sécurisées (pas de token dans le repo).
- Surveillez l'utilisation de la mémoire et redémarrez régulièrement si nécessaire.
- Pour haute disponibilité, envisagez de déployer plusieurs instances et de désactiver les intents concurrents ou d'utiliser un sharding adapté.

Exemple `pm2`:

```powershell
npm run build; pm2 start ./dist/index.js --name discord-community-bot
```

## FAQ & Dépannage

- Problème: Le bot ne démarre pas et renvoie une erreur sur `Intents`.
  - Solution: Vérifiez la version de `discord.js` et adaptez la création du client en conséquence. Assurez-vous d'avoir les intents requis définis dans `src/index.ts`.

- Problème: Commandes slash non visibles.
  - Solution: Re-enregistrez les commandes via `slashRegistrar.ts` et attendez la propagation ; pour tests rapides, utilisez l'enregistrement global ou guild-specific.

- Problème: Permissions insuffisantes pour gérer les rôles.
  - Solution: Vérifiez que le rôle du bot est supérieur aux rôles qu'il doit gérer et que l'autorisation 'Manage Roles' est activée pour le bot.

## Licence

Ce projet est sous licence  **GNU GENERAL PUBLIC** (voir `LICENSE` si présent).

---

## 👨‍💻 Développeur

* Développé par **sexualwhisper**
* [Profil Discord](https://discord.com/users/690749637921079366)

---

