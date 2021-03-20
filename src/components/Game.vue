<template>
  <div>
    <WaitingNewGame v-if="waitNewGame"/>
    <WaitingGame v-if="waitGame && !waitNewGame"/>
    <InGame v-if="!waitNewGame && !waitGame"/>
  </div>
</template>

<script>
import WaitingNewGame from './util/WaitingNewGame'
import WaitingGame from './util/WaitingGame'
import InGame from './util/InGame'
export default {
  components: {
    InGame,
    WaitingNewGame,
    WaitingGame
  },
  computed: {
    waitNewGame () {
      return this.$store.getters['GameStore/waitNewGame']
    },
    waitGame () {
      return this.$store.getters['GameStore/waitGame']
    }
  },
  created () {
    this.$store.dispatch('GameStore/msgAdmin')
  },
  beforeRouteLeave (to, from, next) {
    this.$store.dispatch('GameStore/quit')
    // this.$store.dispatch('GameStore/closeSocket')
    next()
  }
}
</script>

<style scoped>
</style>
