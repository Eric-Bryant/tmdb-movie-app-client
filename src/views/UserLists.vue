<template>
  <v-container v-if="!loading">
    <h1>Your Lists</h1>
    <div v-if="userLists.length > 0">
      <p v-for="list in userLists" :key="list.index">
        <v-btn :to="{ name: 'UserWatchList' }"> {{ list }}</v-btn>
      </p>
    </div>
  </v-container>
  <v-container v-else fill-height class="justify-center">
    <div class="d-flex align-center flex-column">
      <h1 class="mb-2 text-uppercase">Loading details...</h1>
      <LoadingRoller />
    </div>
  </v-container>
</template>

<script>
import dbClient from '../services/dbCalls'
import Firebase from '../firebase'
import { mapGetters } from 'vuex'
import LoadingRoller from '../components/LoadingRoller'

export default {
  name: 'UserLists',
  components: {
    LoadingRoller
  },
  data() {
    return {
      userLists: [],
      loading: true
    }
  },
  computed: {
    ...mapGetters(['getUID'])
  },
  methods: {
    async getLists() {
      const lists = await dbClient.getUsersLists(this.getUID)
      this.userLists = lists
      this.loading = false
    }
  },
  created() {
    this.getLists()
  }
}
</script>

<style></style>
