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
import { mapGetters, mapActions } from 'vuex'
import Firebase from './firebase'

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
      Firebase.db
        .collection('lists')
        .doc(this.getUID)
        .onSnapshot(snapshot => {
          if (snapshot.exists && snapshot.data().watchList.onList) {
            const userWatchList = snapshot.data().watchList.onList
            const userWatchListIds = Object.keys(userWatchList).map(mediaID => {
              return mediaID
            })
            const watchListArray = userWatchListIds.map(id => {
              const mediaObject = {}
              mediaObject[id] = userWatchList[id]
              return mediaObject
            })
            this.setWatchList(watchListArray)
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
