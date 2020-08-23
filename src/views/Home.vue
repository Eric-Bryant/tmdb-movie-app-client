<template>
  <v-container>
    <h1 class="mb-2">Hi {{ loggedIn ? getDisplayName : 'Anonymous' }}!</h1>
    <h2 v-if="loggedIn">Your Lists</h2>
    <v-row v-if="userLists.length > 0">
      <v-col
        cols="12"
        sm="6"
        md="4"
        v-for="list in userLists"
        :key="list.index"
      >
        <ListCard :list="list" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapGetters } from 'vuex'
import ListCard from '../components/ListCard'
import dbClient from '../services/dbCalls'

export default {
  name: 'Home',
  components: {
    ListCard
  },
  data() {
    return {
      userLists: []
    }
  },
  computed: {
    ...mapGetters(['getDisplayName', 'loggedIn', 'getUID'])
  },
  methods: {
    async getLists() {
      const lists = await dbClient.getUsersLists(this.getUID)
      this.userLists = lists
    }
  },
  created() {
    if (this.loggedIn) {
      this.getLists()
    }
  }
}
</script>
