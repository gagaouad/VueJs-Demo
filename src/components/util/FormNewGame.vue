<template>
  <div class="home-menu footer l-box is-center">
    <div class="pure-form pure-form-stacked">
      <fieldset>
        <label>Pseudo : </label>
        <input type="text" id="pseudo" v-model="pseudo">
        <input @click="newGame" type="button" value="NOUVELLE PARTIE" class="pure-button pure-button-primary">
      </fieldset>
    </div>
  </div>
</template>

<script>
export default {
  computed: {
    pseudo: {
      get () {
        return this.$store.getters['GameStore/pseudo']
      },
      set (value) {
        this.$store.dispatch('GameStore/updatePseudo', value)
      }
    }
  },
  store: this.$store,
  methods: {
    newGame () {
      // update la position du joueur dans le gameStore et envoie au serveur
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(this.setPosition)
      }
      // the version with static corrdinates
      // this.$store.dispatch('GameStore/updatePos', this.$store.getters['MapStore/position'])
    },
    setPosition (position) {
      let pos = {lat: position.coords.latitude, lon: position.coords.longitude}
      // geolocation version: gets the location from the geolocation and puts it into position
      this.$store.dispatch('GameStore/updatePos', pos)
      // envoie au serveur les data et change de vue
      this.$store.dispatch('GameStore/newGame')
    }
  }
}
</script>

<style scoped>
</style>
