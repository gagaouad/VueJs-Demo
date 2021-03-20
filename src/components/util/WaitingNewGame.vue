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
    <div class="splash-container">
      <div class="splash">
        <h1 class="splash-head">Bienvenue {{ pseudo }}</h1>
        <p class="splash-subhead">
          En attente d'un deuxième joueur
        </p>
        <div class="lds-ellipsis"><div></div><div></div><div></div><div></div></div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      wait: null
    }
  },
  computed: {
    pseudo () {
      return this.$store.getters['GameStore/pseudo']
    }
  },
  methods: {
    // toutes les 5 secondes demande au serveur si un 2eme joueur s'est connecté
    waitSecondPlayer () {
      /* this.wait = setInterval(() => {
        this.$store.dispatch('GameStore/waitSecondPlayer')
      }, 5000) */
      // this.$store.dispatch('GameStore/openWaitPlayerWs')
      this.$store.dispatch('GameStore/msgWaitSecondPlayer')
    }
  },
  beforeDestroy () {
    // clearInterval(this.wait)
  },
  created () {
    this.$store.dispatch('GameStore/msgAdmin')
    this.waitSecondPlayer()
  }
}
</script>

<style scoped>

</style>
