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
        <h1 v-if="nbTours == 0" class="splash-head">Vous êtes connecté avec {{ adversaire }}</h1>
        <div v-if="nbTours>0">
          <h2>Tour n°{{ nbTours }}</h2>
          <h3>Vous êtes à {{ distanceCourante }}m de {{ adversaire }}</h3>
          <h3 v-if="distanceCouranteAdversaire !== null">
          <div v-if="distanceCouranteAdversaire < 30">Attention</div>
          <div v-if="distanceCouranteAdversaire > 30">Vous avez le temps</div>
          {{ adversaire }} est à {{ distanceCouranteAdversaire }}m
          </h3>
        </div>
          <p class="splash-subhead">
            C'est à {{ adversaire }} de jouer
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
    adversaire () {
      return this.$store.getters['GameStore/adversaire']
    },
    nbTours () {
      return this.$store.getters['GameStore/nbTours']
    },
    distanceCourante () {
      return this.$store.getters['GameStore/distanceCourante']
    },
    distanceCouranteAdversaire () {
      return this.$store.getters['GameStore/distanceCouranteAdversaire']
    }
  },
  methods: {
    // toutes les 5 secondes demande au serveur si un 2eme joueur s'est connecté
    waitOtherPlayer () {
      /* this.wait = setInterval(() => {
        this.$store.dispatch('GameStore/waitOtherPlayer')
      }, 5000) */
      this.$store.dispatch('GameStore/msgWaitTrun')
    }
  },
  beforeDestroy () {
    // clearInterval(this.wait)
  },
  created () {
    this.$store.dispatch('GameStore/msgAdmin')
    this.waitOtherPlayer()
  }
}
</script>

<style scoped>

</style>
