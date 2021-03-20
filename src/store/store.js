import Vue from 'vue'
import Vuex from 'vuex'
import GameStore from './GameStore.js'
import MapsStore from './MapStore.js'
import VuexPersist from 'vuex-persistedstate'

Vue.use(Vuex)
const store = new Vuex.Store({
  modules: {
    'GameStore': GameStore,
    'MapStore': MapsStore
  },
  plugins: [VuexPersist({
    paths: ['GameStore', 'MapStore.pos']
  })]
})

export default store
