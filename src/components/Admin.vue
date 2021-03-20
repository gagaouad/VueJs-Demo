<template>
<div class="splash-container">
<h1>Admin</h1>
  <div class="pure-form pure-form-stacked">
    <input type="text" id="message">
    <input @click="sendMessage" type="button" value="Envoyer" class="pure-button pure-button-primary">
  </div>
  <div style="color: #ffffff" overflow="auto" id="console"></div>
</div>
</template>

<script>
export default {
  name: 'Admin',
  methods: {
    sendMessage () {
      this.$store.dispatch('GameStore/adminMessage', document.getElementById('message').value)
    }
  },
  created () {
    this.$store.dispatch('GameStore/openSocket')
    this.$store.dispatch('GameStore/adminInterface')
  }
}
</script>

<style scoped>

</style>
