<template>
  <div>
    <h1 class="mb-2">Hi {{ loggedIn ? getDisplayName : 'Anonymous' }}!</h1>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'WelcomeUser',
  data() {
    return {}
  },
  computed: {
    ...mapGetters(['getDisplayName', 'loggedIn'])
  }
}
</script>

<style lang="scss"></style>
