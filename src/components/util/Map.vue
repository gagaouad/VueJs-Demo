<template>
    <div @click="clicMap" id="map"/>
</template>

<script>
export default {
  data () {
    return {
    }
  },
  mounted () {
    this.$store.dispatch('MapStore/init')
  },
  computed: {
    position () {
      return this.$store.getters['MapStore/position']
    },
    mymap () {
      return this.$store.getters['MapStore/mymap']
    }
    // exemple de fonctions comme les getters qui utilise le store mais propre a chaque components
    // donc utile avec : this.$store.getters.etc
  },
  methods: {
    clicMap () {
      this.$store.dispatch('MapStore/clicMap')
    }
    // different de computed car les noms de fonction de computed peuvent etre appelé par {{fctComputed}}
    // et ici c'est juste des fonctions classique avec des paramétres qui sont utilisés avec this.fctMethod(abc)
    // @click="fctMethods"
    // utilié aussi pour les commit de mutations : this.$store.commit('fctMutations', abc)
  }
}
</script>

<style>
  body {
    padding: 0;
    margin: 0;
  }
  html, body, #map {
    height: 100%;
    width: 100%;
    position: fixed;
  }
</style>
