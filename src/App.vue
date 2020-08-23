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
    ...mapGetters(['getUID', 'loggedIn', 'getWatchList', 'getWatchedList']),
    storeWatchedListIds() {
      return this.getWatchedList.map(title => {
        return Object.keys(title).join()
      })
    },
    storeWatchListIds() {
      return this.getWatchList.map(title => {
        return Object.keys(title).join()
      })
    }
  },
  methods: {
    ...mapActions(['setWatchList', 'setWatchedList'])
  },
  created() {
    if (this.loggedIn) {
      Firebase.db
        .collection('lists')
        .doc(this.getUID)
        .onSnapshot(snapshot => {
          if (snapshot.exists) {
            const userWatchList = snapshot.data().watchList.onList
            const userWatchedList = snapshot.data().watched.onList
            const userWatchListIds = Object.keys(userWatchList).map(mediaID => {
              return mediaID
            })

            const userWatchedListIds = Object.keys(userWatchedList).map(
              mediaID => {
                return mediaID
              }
            )

            const watchListArray = userWatchListIds.map(id => {
              const mediaObject = {}
              mediaObject[id] = userWatchList[id]
              return mediaObject
            })

            const watchedListArray = userWatchedListIds.map(id => {
              const mediaObject = {}
              mediaObject[id] = userWatchedList[id]
              return mediaObject
            })

            if (
              JSON.stringify(this.storeWatchListIds) !=
              JSON.stringify(userWatchListIds)
            ) {
              console.log('watch list changed')
              this.setWatchList(watchListArray)
            }

            if (
              JSON.stringify(this.storeWatchedListIds) !=
              JSON.stringify(userWatchedListIds)
            ) {
              console.log('watched list changed')
              this.setWatchedList(watchedListArray)
            }
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
</style>
