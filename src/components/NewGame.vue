<template>
  <div>
    <div class="header">
      <div class="home-menu pure-menu pure-menu-horizontal pure-menu-fixed">
        <li class="pure-menu-heading">Nouvelle Partie</li>
      </div>
    </div>
    <Map/>
    <!--footer-->
    <FormNewGame/>
    <!---------->
  </div>
</template>

<script>
import Map from './util/Map'
import FormNewGame from './util/FormNewGame'
export default {
  components: {
    Map,
    FormNewGame
  },
  computed: {
    resetCircle () {
      return this.$store.commit('GameStore/RESET_CIRCLE')
    }
  },
  created () {
    this.$store.dispatch('GameStore/openSocket')
    this.$store.dispatch('GameStore/msgAdmin')
  }
}
</script>

<style scoped>
</style>
