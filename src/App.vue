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
    ...mapGetters(['getUID'])
  },
  methods: {
    ...mapActions(['setWatchList'])
  },
  created() {
    dbClient.getUsersWatchList(this.getUID).then(watchList => {
      if (watchList) {
        this.setWatchList(watchList)
      }
    })
  }
}
</script>

<style lang="scss"></style>
