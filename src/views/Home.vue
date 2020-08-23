<template>
  <v-container>
    <h1 class="mb-2">Hi {{ loggedIn ? getDisplayName : 'Anonymous' }}!</h1>
    <h2 v-if="loggedIn">Your Lists</h2>
    <v-row v-if="userLists.length > 0">
      <v-col
        cols="12"
        sm="6"
        md="3"
        v-for="list in userLists"
        :key="list.index"
      >
        <v-card>
          <div class="d-flex flex-no-wrap justify-space-between">
            <div>
              <v-card-title>{{ list.name }}</v-card-title>
              <v-card-subtitle
                >{{ list.length }}
                {{ list.length > 1 || list.length == 0 ? 'titles' : 'title' }}
                on this list</v-card-subtitle
              >
            </div>
            <v-spacer></v-spacer>
            <v-avatar class="ma-3" size="64" tile>
              <v-img
                :src="listImageBaseURL + list.image"
                v-if="list.image"
              ></v-img>
              <v-icon size="64" v-else>mdi-view-list</v-icon>
            </v-avatar>
          </div>
          <v-card-actions
            ><v-btn small :to="{ name: 'UserWatchList' }" color="primary"
              >View</v-btn
            ></v-card-actions
          >
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapGetters } from 'vuex'
import dbClient from '../services/dbCalls'

export default {
  name: 'Home',
  data() {
    return {
      userLists: []
    }
  },
  computed: {
    ...mapGetters(['getDisplayName', 'loggedIn', 'getUID']),
    listImageBaseURL() {
      return 'https://image.tmdb.org/t/p/w92/'
    }
  },
  methods: {
    async getLists() {
      const lists = await dbClient.getUsersLists(this.getUID)
      this.userLists = lists
    }
  },
  created() {
    this.getLists()
  }
}
</script>
