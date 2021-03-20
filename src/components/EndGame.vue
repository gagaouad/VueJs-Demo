<template>
<div>
  <div class="header">
    <div class="home-menu pure-menu pure-menu-horizontal pure-menu-fixed">
      <a class="pure-menu-heading" href="">MapApp</a>

      <ul class="pure-menu-list">
        <li class="pure-menu-item"><router-link to="NewGame" class="pure-menu">Quitter Partie</router-link></li>
      </ul>
    </div>
  </div>
  <div>
    <div class="splash-container">
      <div class="splash">
        <h1 v-show="win && !twoPlayers" class="splash-head">Bravo vous avez gagné</h1>
        <h1 v-show="!win && !twoPlayers" class="splash-head">Désolé vous avez perdu ou l'adversaire a quitté la partie</h1>
        <h1 v-show="twoPlayers" class="splash-head">Déja 2 joueurs connectés veuillez patienter</h1>
        <p class="splash-subhead">
          <router-link to="NewGame">Nouvelle Partie</router-link>
        </p>
      </div>
    </div>

  </div>
</div>
</template>

<script>
import Map from './util/Map'
export default {
  components: {
    Map
  },
  computed: {
    win () {
      return this.$store.getters['GameStore/win']
    },
    twoPlayers () {
      return this.$store.getters['GameStore/twoPlayers']
    }
  },
  beforeRouteLeave (to, from, next) {
    this.$store.commit('GameStore/INIT_WIN')
    this.$store.commit('GameStore/INIT_ADVERSE')
    this.$store.commit('GameStore/RESET_CIRCLE')
    this.$store.commit('GameStore/INIT_TWO_PLAYERS')
    next()
  },
  created () {
    this.$store.dispatch('GameStore/msgAdmin')
  }
}
</script>

<style scoped>

</style>
