const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
// const fs = require('fs')
// const https = require('https')
const morgan = require('morgan')
const app = express()

const expressWs = require('express-ws')(app)

app.use(morgan('combined')) // pour avoir plus d'info dans le terminal
app.use(bodyParser.json())
app.use(cors())
// app.listen(process.env.PORT || 8080)
app.use(express.static('dist'))
app.listen(80)
// https.createServer({
//     key: fs.readFileSync('key.pem'),
//     cert: fs.readFileSync('cert.pem'),
//     passphrase: 'azertyuiop'
// }, app).listen(process.env.PORT || 8081)
//
// app.get('/', function (req, res) {
//     res.header('Content-type', 'text/html')
//     return res.end('<h1>Hello, Secure World!</h1>')
// })
/*********** Données *********/
var Joueurs = []
// Joueur[0] = {pseudo: "abc", lat: 123, lon: 234}
var IdJoueur = 1// l'id du joueur qui joue
var DistanceCourante = [] // stock à chaque tour la distance trouvée par les 2 joueurs

/********* Fonctions ****$**/
function deg2rad(x) {
  return Math.PI * x / 180
}

function calculeDistance(lat1, lng1, lat2, lng2) {
  let earth_radius = 6378137   // Terre = sphère de 6378km de rayon
  let rlo1 = deg2rad(lng1)    // CONVERSION
  let rla1 = deg2rad(lat1)
  let rlo2 = deg2rad(lng2)
  let rla2 = deg2rad(lat2)
  let dlo = (rlo2 - rlo1) / 2
  let dla = (rla2 - rla1) / 2
  let a = (Math.sin(dla) * Math.sin(dla)) + Math.cos(rla1) * Math.cos(rla2) * (Math.sin(dlo) * Math.sin(dlo))
  let d = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  let result = earth_radius * d //resultat en m
  return {
    victoire: result < 10, // victoire si +/- 10m
    distance: result
  }
}

// choisi quel joueur joue en premier
// elle n'est pas utilisé pour l'instant
function randomId() {
  /**
   * TODO
   */
  let id = 1
  IdJoueur = id
  return id
}

app.post('/newGame', (req, res) => {
  if (Joueurs.length === 2)
    res.send({twoPlayers: true})
  else {
    Joueurs.push(req.body.joueur)
    let data = {
      adversaire: '',
      id: Joueurs.length - 1 //indique le premier ou le 2eme joueurs
    }
    if (Joueurs.length === 2)
      data.adversaire = Joueurs[0].pseudo
    res.send(data)
  }
})

// requete d'attente d'un 2eme joueur
/* app.get('/waitSecondPlayer', (req, res) => {
    if (Joueurs.length === 2)
        res.send({adversaire: Joueurs[1].pseudo, waitNewGame: false})
    else res.send({waitNewGame: true})
}) */
// app.get('/test', (req, res) => {
//   res.send('testeeeeee')
// })
// requete d'attente que l'autre joueur joue
/* app.post('/waitOtherPlayer', (req, res) => {
  if (Joueurs.length != 0) {
    if (req.body.id === IdJoueur) {
      res.send({waitNewGame: false, distance: DistanceCourante[req.body.id]}) // attend si c'est pas à lui de jouer
    } else {
      res.send({waitGame: true})
    }
    // res.send({adversaire: Joueurs[1].pseudo, waitNewGame: false})
  } else { // si un des joueurs quitte la partie renvoie fin de la partie a celui qui attend
    res.send({endGame: true})
  }
}) */

app.post('/posAdverse', (req, res) => {
  if (Joueurs.length != 0) {
    let idAdverse
    if (req.body.id === 0) {
      idAdverse = 1
      IdJoueur = 1 // c'est à l'autre joueur de jouer
    } else {
      idAdverse = 0
      IdJoueur = 0
    }
    let data = calculeDistance(Joueurs[idAdverse].lat, Joueurs[idAdverse].lon, req.body.adversaire.lat, req.body.adversaire.lon)
    DistanceCourante[idAdverse] = data.distance
    Wss.clients.forEach(function (client) {
      client.send(JSON.stringify({type: 'tire',hit: false}))
    })
    if (data.victoire) {
      data["pos"] = {
        lat: Joueurs[idAdverse].lat,
        lon: Joueurs[idAdverse].lon
      }
      Joueurs = [] // réinitialise es joueurs lorsque'un joueur gagne
      IdJoueur = 1
      Wss.clients.forEach(function (client) {
        client.send(JSON.stringify({type: 'tire',hit: true}))
      })
    }
    res.send(data)
  } else {
    res.send({endGame: true})
  }
})

app.post('/quit', (req, res) => {
  Joueurs = [] // supprime les joueurs
  IdJoueur = 1
  res.end() // renvoie réponse vide
})

app.post('/AdminMessage', (req) => {
  Wss.clients.forEach(function (client) {
    client.send(JSON.stringify({type: 'admin', value: req.body.msg}))
  })
})

// webSockets

/*
app.ws('/PlayerPosition', function (ws) {
  ws.on('message', function (msg) {
    console.log('i received ', JSON.parse(msg))
  })
  ws.on('close', function (code, msg) {
    console.log('ws Position closed')
  })
})

app.ws('/waitPlayerWs', function (ws) {
  ws.on('close', function (code, msg) {
    console.log('ws waitPlayer socket closed')
  })

}) */
/*
var WaitPlayerWS = [] // contain ws arrived in order
var wPWS = expressWs.getWss('/waitPlayerWs') //contains all the WS sent to waitPlayer

app.ws('/waitTurnWs', function (ws) {
  ws.on('message', function (msg) {
    let theId = JSON.parse(msg).id
    if (Joueurs.length != 0) {
      console.log(theId, '===', IdJoueur, 'contains', turnWS.length, 'and wai player', WaitPlayerWS.length)
      let dist = {distance: DistanceCourante[IdJoueur]}
      console.log('distance is ', dist, ' and the ws is in state ', turnWS[theId].readyState, ' and it is ', turnWS[theId])
      turnWS[theId].send(JSON.stringify(dist)) // attend si c'est pas à lui de jouer
      if (theId === 0) {
        turnWS[1].send(JSON.stringify({waitGame: false}))
      } else {
        turnWS[0].send(JSON.stringify({waitGame: false}))
      }
      // res.send({adversaire: Joueurs[1].pseudo, waitNewGame: false})
    } else { // si un des joueurs quitte la partie renvoie fin de la partie a celui qui attend
      lTurnWS.forEach(function (client) {
        client.send(JSON.stringify({endGame: true}))
      })
    }
  })
*/
// on open
/*console.log('iturn', lTurnWS.size(), 'WWPS', wPWS.size())
lTurnWS.clients.forEach(function (client) {
  let check = false;
  console.log('am herre ##########')
   turnWS.forEach(function (cl) {
      if (client === cl) {
        check = true
      }
   })
  if (check === false) {
    turnWS.push(client)
    console.log('pushed')
  }
})
ws.on('close', function () {
  console.log('Wait trun ws closed')
})
ws.on('message', function (msg) {
  lTurnWS.clients.forEach(function (client) {
    client.send('fuck you')
  })
})
ws.on('close', function () {
  console.log('Wait turn socket closed')
})
})
var turnWS = []
var lTurnWS = expressWs.getWss('/waitTurnWs')
*/
app.ws('/webSocket', function (ws) {
  ws.on('message', function (msg) {
    let info = JSON.parse(msg)
    switch (info.type) {
      case 'waitPlayer' : {
        if (Joueurs.length === 2) {
          let response = {type: 'waitPlayer', adversaire: Joueurs[1].pseudo, waitNewGame: false}
          Wss.clients.forEach(function (client) {
            client.send(JSON.stringify(response))
          })
        }
        break;
      }
      case 'PlayerPosition' : {
        Wss.clients.forEach(function (client) {
          client.send(JSON.stringify(info))
        })
        break;
      }
      case 'turn': {
        let theId = info.id
        if (Joueurs.length != 0) {
          let sender = {type: 'turn', id: theId, distance: DistanceCourante[theId]} // attend si c'est pas à lui de jouer
          let waiter = {type: 'turn', id: theId, waitGame: false}
          if (info.win !== undefined) {
            waiter = {type: 'turn', id: theId, waitGame: false, endGame: true, win: false}
          }
          Wss.clients.forEach(function (client) {
            client.send(JSON.stringify(sender))
            client.send(JSON.stringify(waiter))
          })
        } else { // si un des joueurs quitte la partie renvoie fin de la partie a celui qui attend
          Wss.clients.forEach(function (client) {
            client.send(JSON.stringify({type: 'turn', endGame: true}))
          })
        }
        break;
      }
    }
  })
  /* Wss.clients.forEach(function (client) {
    let contains = false;
    socketList.forEach(function (elem) {
      if (elem === client) {
        contains= true;
      }
    })
    if (!contains) {
      socketList.push(client)
    }
  }) */
})
let socketList = [];
let Wss = expressWs.getWss('/webSocket')
