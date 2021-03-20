import * as L from 'leaflet'
import { GestureHandling } from 'leaflet-gesture-handling'
import 'leaflet/dist/leaflet.css'
import 'leaflet-gesture-handling/dist/leaflet-gesture-handling.css'
const state = {
  mymap: undefined,
  markers: [],
  curPosMarker: undefined,
  watchId: undefined,
  pos: {
    lat: 45.78207,
    lon: 4.86559,
    zoom: 15
  },
  markerGroup: undefined
}

const getters = {
  position: state => {
    return {
      lat: state.pos.lat,
      lon: state.pos.lon,
      zoom: state.pos.zoom
    }
  },
  zoom: state => {
    return state.pos.zoom
  },
  mymap: state => {
    return state.mymap
  },
  circle: state => {
    return state.circle
  }
}

const actions = {
  updateLat ({ dispatch, state, commit }, value) {
    commit('UPDATE_LAT', value)
  },
  updateLon ({ dispatch, state, commit }, value) {
    commit('UPDATE_LON', value)
  },
  // Mise à jour de la map
  updateMap ({ state, dispatch, rootGetters }) {
    // Affichage à la nouvelle position
    state.mymap.setView([state.pos.lat, state.pos.lon], state.pos.zoom)

    // dispatch('updateMarkers');
    // affiche un cercle autour du joueur si il a raté son coups
    if (rootGetters['GameStore/circle'] === true) {
      dispatch('setCircle')
    }
    // affiche la position de l'adversaire si le joueur à gagné
    if (rootGetters['GameStore/win'] === true) {
      dispatch('setMarker')
    }
    // affiche le marqueur sur la posion de tir
    if (state.markers.length > 0) {
      dispatch('setTryPositionMarker')
    }
    // La fonction de validation du formulaire renvoie false pour bloquer le rechargement de la page.
    return false
  },
  updateZoom ({ dispatch, state, commit }, value) {
    commit('UPDATE_ZOOM', value)
    dispatch('updateMap')
  },
  setMarker ({state, commit, rootGetters}) {
    if (rootGetters['GameStore/posAdverse'][0] !== undefined && rootGetters['GameStore/posAdverse'][0] !== '') {
      L.marker(rootGetters['GameStore/posAdverse']).addTo(state.mymap)
      commit('GameStore/UPDATE_CIRCLE', false, {root: true})
    }
  },
  setCircle ({state, commit, rootGetters}) {
    L.circle(rootGetters['GameStore/posAdverse'], {
      color: 'red',
      fillColor: '#f03',
      fillOpacity: 0.5,
      radius: 10
    }).addTo(state.mymap)
    commit('GameStore/UPDATE_CIRCLE', true, {root: true})
  },
  setTryPositionMarker ({state}) {
    // L.marker(state.markers[state.markers.length - 1]).addTo(state.mymap)
    L.circle(state.markers[state.markers.length - 1], {
      color: 'orange',
      fillColor: '#ff6b09',
      fillOpacity: 0.5,
      radius: 10
    }).addTo(state.mymap).bindPopup('Boom ?!!').openPopup()
  },
  init ({ dispatch, state, rootGetters }) {
    // initialisation de la map
    L.Icon.Default.imagePath = '/modules/leaflet/dist/images/'
    L.Map.addInitHook('addHandler', 'gestureHandling', GestureHandling)
    state.mymap = L.map('map', {zoomControl: false, gestureHandling: true}).setView([state.pos.lat, state.pos.lon], state.pos.zoom)
    dispatch('updateMap')
    // Création d'un "tile layer" (permet l'affichage sur la carte)
    L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibTFpZjEzIiwiYSI6ImNqczBubmhyajFnMnY0YWx4c2FwMmRtbm4ifQ.O6W7HeTW3UvOVgjCiPrdsA', {
      maxZoom: 20,
      minZoom: 1,
      attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
        '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
        'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
      id: 'mapbox.streets'
    }).addTo(state.mymap)
  },
  clearMarkers ({ commit }) {
    commit('initMarkers')
  },
  clicMap ({ state, dispatch, commit, rootGetters }) {
    state.mymap.on('click', function (e) {
      commit('UPDATE_LAT', e.latlng.lat)
      commit('UPDATE_LON', e.latlng.lng)
      commit('addMarker', [e.latlng.lat, e.latlng.lng])
      if (state.markers.length) {
        dispatch('setTryPositionMarker')
        dispatch('updateMap')
      }
    })
    // Affichage à la nouvelle position
    // state.mymap.setView([state.pos.lat, state.pos.lon], state.pos.zoom)
    // dispatch('updateMarkers');

    // La fonction de validation du formulaire renvoie false pour bloquer le rechargement de la page.
  }
}

const mutations = {
  initMarkers (state) {
    state.markers = []
  },
  addMarker (state, value) {
    state.markers.push(value)
  },
  UPDATE_LON (state, value) {
    state.pos.lon = value
  },
  UPDATE_LAT (state, value) {
    state.pos.lat = value
  },
  UPDATE_ZOOM (state, value) {
    state.pos.zoom = value
  },
  initMarkerGroupe (state) {
    state.markerGroup = L.layerGroup().addTo(state.mymap)
  }
}

export default {
  namespaced: true,
  state,
  getters, // pour get le store d'une manière générale au lieu que dans chaque vue faire this.$store.etc
  actions, // pour des appels de mutations asynchrones utilisé avec this.$store.dispatch('fctAction',abc)
  mutations // seul moyen pour changer le store utilisé avec this.$store.commit('fctMutation')
}
