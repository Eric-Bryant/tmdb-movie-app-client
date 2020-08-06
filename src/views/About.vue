<template>
  <div class="about">
    <h1 v-if="loggedIn">This is an about page</h1>
    <h1 v-else>Poop</h1>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'About',
  data() {
    return {}
  },
  computed: {
    ...mapGetters(['loggedIn'])
  }
}
</script>
