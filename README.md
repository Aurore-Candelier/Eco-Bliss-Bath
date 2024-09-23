## Démarrer le projet
1. Installer et ouvrir Docker
2. Ouvrir le projet dans VSCode
3. Depuis un terminal ouvert dans le dossier du projet, lancer la commande : `docker-compose up`
4. Ouvrez le site depuis la page http://localhost:8080 

## Ouverture de Cypress
1. Depuis le terminal, lancer la commande : `npx cypress open`
2. Cliquer sur **E2E Testing**
3. Une page s'affiche, choisissez votre navigateur préféré
4. Cliquez sur **Start E2E Testing in ...**
5. Cypress s'ouvre
6. Dans le dossier **cypress\e2e**, il y a les pages des tests réalisés

## Tests
Cliquer sur le test que vous voulez voir, il se lance automatiquement.

Une fois les tests terminés, ils sont en vert, si un ou plusieurs tests sont rouge cela signifie qu'ils sont échoués.
