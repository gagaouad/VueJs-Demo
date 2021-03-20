import GameService from '../services/GameService'
import router from '../router'

const state = {
  id: 0,
  joueur: {
    pseudo: '',
    lat: '',
    lon: ''
  },
  nbTours: 0,
  distanceCourante: null,
  distanceCouranteAdversaire: null,
  win: false,
  waitNewGame: false, // attente d'un 2eme joueur
  waitGame: false, // attente que l'autre joueur joue
  endGame: false,
  twoPlayers: false,
  adversaire: {
    pseudo: '',
    lat: '',
    lon: ''
  },
  circle: false,
  theTimer: 30,
  startTimer: null,
  clientSocket: null,
  address: '',
  console: ''
}

const getters = {
  position: state => {
    return {
      lat: state.joueur.lat,
      lon: state.joueur.lon
    }
  },
  pseudo: state => {
    return state.joueur.pseudo
  },
  id: state => {
    return state.id
  },
  nbTours: state => {
    return state.nbTours
  },
  distanceCourante: state => {
    return state.distanceCourante
  },
  distanceCouranteAdversaire: state => {
    return state.distanceCouranteAdversaire
  },
  waitNewGame: state => {
    return state.waitNewGame
  },
  waitGame: state => {
    return state.waitGame
  },
  twoPlayers: state => {
    return state.twoPlayers
  },
  adversaire: state => {
    return state.adversaire.pseudo
  },
  win: state => {
    return state.win
  },
  endGame: state => {
    return state.endGame
  },
  circle: state => {
    return state.circle
  },
  posAdverse: state => {
    return [state.adversaire.lat, state.adversaire.lon]
  },
  getTimer: state => {
    return state.theTimer
  },
  getAddress: state => {
    return state.address
  }
}

const actions = {
  async newGame ({dispatch, state, commit}) {
    await GameService.new({
      joueur: state.joueur
    }).then((response) => {
      if (response.data.twoPlayers) {
        commit('UPDATE_TWO_PLAYERS', true) // si deja 2 joueurs qui sont conectés
        router.push('EndGame') // on le met directement à la fin de la partie
      } else {
        commit('UPDATE_ADVERSAIRE', response.data.adversaire)
        commit('UPDATE_ID', response.data.id)
        if (response.data.id === 0) { // si c'est le premier joueur alors il attend
          commit('UPDATE_WAIT_NEW_GAME', true)
          commit('UPDATE_WAIT_GAME', true) // le joueur arrivant en dernier commencera la partie
        } else {
          dispatch('openSocket')
          dispatch('sendWaitSecondPlayer')
        }
        router.push('Game')
      }
    })
  },
  // l'attente d'un 2eme joueur
  /* async waitSecondPlayer ({dispatch, state, commit}) {
    await GameService.waitSecondPlayer().then((response) => {
      commit('UPDATE_WAIT_NEW_GAME', response.data.waitNewGame)
      commit('UPDATE_ADVERSAIRE', response.data.adversaire)
    })
  }, */
  /* async waitOtherPlayer ({dispatch, state, commit}) {
    await GameService.waitOtherPlayer({
      id: state.id
    }).then((response) => {
      if (response.data.endGame) { // a perdu ou l'autre a quitté
        router.push('EndGame')
      }
      commit('UPDATE_WAIT_GAME', response.data.waitGame)
      if (response.data.distance !== undefined) {
        commit('UPDATE_DISTANCE_COURANTE_ADVERSAIRE', response.data.distance) // distance que l'adversaire a essayé de toucher
      }
    })
  }, */
  async sendPosAdverse ({dispatch, state, commit}) {
    await GameService.posAdverse({
      id: state.id,
      adversaire: state.adversaire
    }).then((response) => {
      if (response.data.endGame) { // si l'adversaire quitte
        router.push('EndGame') // EndGame et win= false
      } else if (response.data.victoire) {
        commit('UPDATE_CIRCLE', false)
        commit('UPDATE_WIN', true)
        commit('UPDATE_POS_ADVERSE', {lat: response.data.pos.lat, lon: response.data.pos.lon})
        dispatch('sendWaitTrun')
        dispatch('msgWaitTrun')
        router.push('EndGame')
      } else { // si pas de victoire ni l'adversaire quitte
        dispatch('MapStore/setCircle', null, {root: true})
        commit('UPDATE_WAIT_GAME', true) // dès qu'il a joué il attend
        dispatch('sendWaitTrun')
        dispatch('msgWaitTrun')
        commit('UPDATE_TOURS') // nbtours++
        commit('UPDATE_DISTANCE_COURANTE', response.data.distance) // distance  de l'adversaire
      }
    })
  },
  async quit ({dispatch, state, commit}) {
    await GameService.quit({
      id: state.id
    }).then((response) => {
      commit('INIT_GAME')
    })
  },
  async adminMessage ({commit, dispatch, state}, value) {
    console.log(value)
    await GameService.adminMessage({msg: value})
  },
  updatePosAdverse ({ dispatch, state, commit }, value) {
    commit('UPDATE_POS_ADVERSE', value)
  },
  updatePos ({ dispatch, state, commit }, value) {
    commit('UPDATE_POS', value)
  },
  updatePseudo ({ dispatch, state, commit }, value) {
    commit('UPDATE_PSEUDO', value)
  },
  chrono ({state, commit}) {
    commit('UPDATE_TIMER')
  },
  endTimer ({commit}) {
    commit('INIT_TIMER')
  },
  // Web Sockets
  /* openPosWs ({commit}) {
    commit('INIT_POS_WS')
  },
  sendPosWs ({state}) {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(getGeoLocation)
    }
    function getGeoLocation (position) {
      let info = {id: state.id, lat: position.coords.latitude, lon: position.coords.longitude}
      state.wsPosition.onopen = () => {
        state.wsPosition.send(JSON.stringify(info))
      }
    }
  },
  openWaitPlayerWs ({commit}) {
    commit('INIT_WAITPLAYER_WS')
  },
  sendWaitPlayerWs ({state, commit}) {
    state.wsWaitPlayer.onopen = () => {
      state.wsWaitPlayer.send('hello there')
    }
    state.wsWaitPlayer.onmessage = event => {
      console.log('the Alpha recieved', event.data)
    }
  },
  MsgWaitPlayerWS ({state, commit}) {
    state.wsWaitPlayer.onmessage = event => {
      let result = JSON.parse(event.data)
      commit('UPDATE_WAIT_NEW_GAME', result.waitNewGame)
      commit('UPDATE_ADVERSAIRE', result.adversaire)
    }
  },
  openWaitTurn ({state, commit}) {
    if (state.wsWaitTurn.readyState === undefined) {
      commit('INIT_WAIT_TURN_WS')
      console.log('ws opnened ...')
    }
  },
  sendWaitTrun ({state}) {
    console.log('nigga', state.wsWaitTurn.readyState)
    state.wsWaitTurn.onopen = () => {
      state.wsWaitTurn.send(JSON.stringify({id: state.id}))
    }
  },
  msgWaitTrun ({state, commit}) {
    console.log('bitch', state.wsWaitTurn.readyState)
    state.wsWaitTurn.onmessage = event => {
      let info = JSON.parse(event.data)
      console.log(info)
      if (info.endGame) { // a perdu ou l'autre a quitté
        router.push('EndGame')
      }
      commit('UPDATE_WAIT_GAME', info.waitGame)
      if (info.distance !== undefined) {
        commit('UPDATE_DISTANCE_COURANTE_ADVERSAIRE', info.distance) // distance que l'adversaire a essayé de toucher
      }
    }
  } */
  openSocket ({state, commit}) {
    commit('OPEN_WEB_SOCKET')
  },
  sendWaitSecondPlayer ({state}) {
    state.clientSocket.onopen = () => {
      setTimeout(() => {
        state.clientSocket.send(JSON.stringify({type: 'waitPlayer'}))
      })
    }
  },
  msgWaitSecondPlayer ({state, commit}) {
    state.clientSocket.onmessage = event => {
      let result = JSON.parse(event.data)
      if (result.type === 'waitPlayer') {
        commit('UPDATE_WAIT_NEW_GAME', result.waitNewGame)
        commit('UPDATE_ADVERSAIRE', result.adversaire)
      }
    }
  },
  sendPos ({state, commit}) {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(getGeoLocation)
    }
    function getGeoLocation (position) {
      var HttpClient = function () {
        this.get = function (aUrl, aCallback) {
          var anHttpRequest = new XMLHttpRequest()
          anHttpRequest.onreadystatechange = function () {
            if (anHttpRequest.readyState === 4 && anHttpRequest.status === 200) {
              aCallback(anHttpRequest.responseText)
            }
          }
          anHttpRequest.open('GET', aUrl, true)
          anHttpRequest.send(null)
        }
      }
      let token = 'pk.eyJ1IjoiZGNzZGRhcmtuZXNzIiwiYSI6ImNqdDhtcTl6ajAwa3Y0OXF2MTF6OXAxODgifQ.0dxcxcmKFiKD5k-knaq1RQ'
      let coord = position.coords.longitude + ',' + position.coords.latitude
      let url = 'https://api.mapbox.com/geocoding/v5/mapbox.places/' + coord + '.json?access_token=' + token
      let request = new HttpClient()
      request.get(url, function (response) {
        let result = JSON.parse(response)
        let adress = result.features[0].place_name
        commit('SET_ADDRESS', adress)
        let info = {type: 'PlayerPosition', id: state.id, lat: position.coords.latitude, lon: position.coords.longitude, adress: adress}
        commit('UPDATE_POS', {lat: position.coords.latitude, lon: position.coords.longitude})
        if (state.clientSocket.readyState === 1) {
          state.clientSocket.send(JSON.stringify(info))
        } else {
          console.log('sending failed!')
        }
      })
    }
  },
  sendWaitTrun ({state}) {
    if (state.clientSocket.readyState === 1) {
      if (state.win === true) {
        state.clientSocket.send(JSON.stringify({type: 'turn', id: state.id, win: false}))
      } else {
        state.clientSocket.send(JSON.stringify({type: 'turn', id: state.id}))
      }
    }
  },
  msgWaitTrun ({state, commit}) {
    state.clientSocket.onmessage = event => {
      let info = JSON.parse(event.data)
      if (info.type === 'turn') {
        if (info.endGame !== undefined) { // a perdu ou l'autre a quitté
          router.push('EndGame')
        }
        if (info.id !== state.id) {
          commit('UPDATE_WAIT_GAME', info.waitGame)
        }
        if (info.distance !== undefined && info.id === state.id) {
          commit('UPDATE_DISTANCE_COURANTE_ADVERSAIRE', info.distance) // distance que l'adversaire a essayé de toucher
        }
      }
    }
  },
  msgAdmin ({state}) {
    state.clientSocket.onmessage = event => {
      let info = JSON.parse(event.data)
      if (info.type === 'admin') {
        window.alert(info.value)
      }
    }
  },
  adminInterface ({state}) {
    state.clientSocket.onmessage = event => {
      console.log(event.data)
      if (document.getElementById('console') !== null) {
        document.getElementById('console').innerHTML += event.data + '<br>'
      }
    }
  },
  closeSocket ({commit}) {
    commit('CLOSE_WEB_SOCKET')
  }
}

const mutations = {
  INIT_GAME (state) {
    state.joueur.lon = ''
    state.joueur.lat = ''
    // state.adversaire.lon = ''
    // state.adversaire.lat = ''
    // state.adversaire.pseudo = ''
    state.id = 0
    state.nbTours = 0
    state.joueur.pseudo = ''
    state.distanceCourante = null
    state.distanceCouranteAdversaire = null
    // state.win = false
    state.waitNewGame = false
    state.waitGame = false
    state.endGame = false
    state.circle = false
  },
  INIT_WIN (state) {
    state.win = false
  },
  INIT_ADVERSE (state) {
    state.adversaire.lat = undefined
    state.adversaire.lon = undefined
    state.adversaire.pseudo = undefined
  },
  INIT_TWO_PLAYERS (state) {
    state.twoPlayers = false
  },
  UPDATE_POS (state, value) {
    state.joueur.lon = value.lon
    state.joueur.lat = value.lat
  },
  UPDATE_POS_ADVERSE (state, value) {
    state.adversaire.lon = value.lon
    state.adversaire.lat = value.lat
  },
  UPDATE_ADVERSAIRE (state, value) {
    state.adversaire.pseudo = value
  },
  UPDATE_DISTANCE_COURANTE (state, value) {
    state.distanceCourante = Math.trunc(value)
  },
  UPDATE_DISTANCE_COURANTE_ADVERSAIRE (state, value) {
    state.distanceCouranteAdversaire = Math.trunc(value)
  },
  UPDATE_ID (state, value) {
    state.id = value
  },
  UPDATE_WAIT_NEW_GAME (state, value) {
    state.waitNewGame = value
  },
  UPDATE_WAIT_GAME (state, value) {
    state.waitGame = value
  },
  UPDATE_TWO_PLAYERS (state, value) {
    state.twoPlayers = value
  },
  UPDATE_TOURS (state) {
    state.nbTours++
  },
  UPDATE_PSEUDO (state, pseudo) {
    state.joueur.pseudo = pseudo
  },
  UPDATE_WIN (state, value) {
    state.win = value
  },
  UPDATE_END_GAME (state, value) {
    state.endGame = value
  },
  UPDATE_CIRCLE (state, value) {
    state.circle = value
  },
  RESET_CIRCLE (state) {
    state.circle = false
  },
  INIT_TIMER (state) {
    state.theTimer = 30
  },
  UPDATE_TIMER (state) {
    state.theTimer = state.theTimer - 1
  },
  OPEN_WEB_SOCKET (state) {
    if (window.location.protocol === 'https:') { // pour le proxy
      state.clientSocket = new WebSocket('wss:' + window.location.hostname + '/41/webSocket')
    } else {
      state.clientSocket = new WebSocket('ws:' + window.location.hostname + '/webSocket')
    }
  },
  CLOSE_WEB_SOCKET (state) {
    state.clientSocket.close()
  },
  SET_ADDRESS (state, value) {
    state.address = value
  }
}
export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
