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
      <router-view></router-view>
    </v-main>
    <TheFooter />
  </v-app>
</template>

<script>
import TheHeader from './layout/TheHeader'
import TheFooter from './layout/TheFooter'
import TheSidePanel from './layout/TheSidePanel'
import dbClient from './services/dbCalls'
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'App',
  components: {
    TheHeader,
    TheFooter,
    TheSidePanel
  },

  data() {
    return {
      drawer: false
    }
  },
  computed: {
    ...mapGetters(['getUID', 'loggedIn'])
  },
  methods: {
    ...mapActions(['setWatchList'])
  },
  created() {
    if (this.loggedIn) {
      dbClient.getUsersWatchList(this.getUID).then(watchList => {
        if (watchList) {
          this.setWatchList(watchList)
        }
      })
    }
  }
}
</script>

<style lang="scss">
.container {
  max-width: 1140px;
  padding: 1rem;
}

img,
iframe {
  max-width: 100%;
}

.row {
  margin: 0;
}
</style>
