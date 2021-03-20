<template>
<div>
  <div class="header">
    <div class="home-menu pure-menu pure-menu-horizontal pure-menu-fixed">
      <li class="pure-menu-heading">Il vous reste {{Timer}} secondes</li>
      <ul class="pure-menu-list">
        <li class="pure-menu-item"><router-link to="NewGame" class="pure-menu">Quitter Partie</router-link></li>
      </ul>
    </div>
  </div>
  <FormGame/>
  <Map/>
  <div><p id="adress"></p></div>
</div>
</template>

<script>
import FormGame from './FormGame'
import Map from './Map'
export default {
  name: 'InGame',
  components: {
    FormGame,
    Map
  },
  computed: {
    Timer () {
      return this.$store.getters['GameStore/getTimer']
    }
  },
  methods: {
    TimerLoop () {
      this.wait = setInterval(() => {
        if (this.$store.getters['GameStore/getTimer'] === 30) {
          navigator.vibrate(1000)
          this.$store.dispatch('GameStore/sendPos')
        }
        if (this.$store.getters['GameStore/getTimer'] % 5 === 0) {
          this.$store.dispatch('GameStore/sendPos')
        }
        if (this.$store.getters['GameStore/getTimer'] > 0) {
          this.$store.dispatch('GameStore/chrono')
        } else if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(this.setPosition)
        }
      }, 1000)
    },
    setPosition (position) {
      let pos = {lat: position.coords.latitude, lon: position.coords.longitude}
      this.$store.dispatch('GameStore/updatePosAdverse', pos)
      this.$store.dispatch('GameStore/sendPosAdverse')
    }
  },
  beforeDestroy () {
    clearInterval(this.wait)
    this.$store.commit('GameStore/INIT_TIMER')
  },
  created () {
    this.TimerLoop()
  }
}
</script>

<style scoped>

</style>
