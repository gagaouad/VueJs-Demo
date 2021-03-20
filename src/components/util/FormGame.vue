<template>
  <div class="home-menu footer l-box is-center">
    <div class="pure-form pure-form-stacked">
      <fieldset>
        <label>Déplacez vous pour trouver {{ adversaire }}</label>
        <input @click="positionAdverse()" type="button" value="VALIDER" class="pure-button pure-button-primary">
        <label> {{ address }} </label>
      </fieldset>
    </div>
  </div>
</template>

<script>
export default {
  computed: {
    adversaire () {
      return this.$store.getters['GameStore/adversaire']
    },
    address () {
      return this.$store.getters['GameStore/getAddress']
    }
  },
  // store: this.$store,
  methods: {
    positionAdverse () {
      this.$store.dispatch('GameStore/updatePosAdverse', this.$store.getters['MapStore/position']) // enregistre dans le gameStore
      this.$store.dispatch('GameStore/sendPosAdverse') // envoie au serveur
    }
  }
}
</script>

<style scoped>
</style>
