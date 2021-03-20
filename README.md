## Build Setup
``` bash
# install dependencies
npm install

# start development hot reload localhost:8080
npm run start-dev
 
# production port 80
sudo npm run build
sudo npm start
```
## Fonctionnalités

- WebStorage 
- Gestion de jeu pour 2 joueurs, Mise en attente d'un nouveau joueur si déjà 2 personnes sont connectées
- Mobile API :
  - Géolocalisation
  - Touch API : Gestion de la Map (zoom et scroll) à 2 doigts
  - Vibration
- Interface Admin avec les logs de requêtes WebSockets et l'envoi d'un message en popup pour tous les joueurs connectés
- Markers et indication de distance de tirs lors du jeu 
