<template>
  <v-app>
    <v-navigation-drawer
      v-model="drawer"
      app
      right
      temporary
      dark
      color="primary"
    >
      <TheSidePanel @toggleNav="drawer = !drawer" />
    </v-navigation-drawer>

    <TheHeader @toggleNav="drawer = !drawer" />
    <v-main>
      <v-container>
        <router-view></router-view>
      </v-container>
    </v-main>
    <TheFooter />
  </v-app>
</template>

<script>
import TheHeader from './layout/TheHeader'
import TheFooter from './layout/TheFooter'
import TheSidePanel from './layout/TheSidePanel'
import mobileCheck from './mixins/mobileCheck'

export default {
  name: 'App',
  mixins: [mobileCheck],
  components: {
    TheHeader,
    TheFooter,
    TheSidePanel
  },

  data() {
    return {
      drawer: false
    }
  }
}
</script>

<style lang="scss"></style>
