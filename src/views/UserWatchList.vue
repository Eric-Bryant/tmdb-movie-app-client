<template>
  <div>
    <h1>Your Watch List</h1>
    <div v-if="userWatchList.length > 0">
      <p v-for="movie in userWatchList" :key="movie.index">
        {{ movie }}
      </p>
    </div>
    <p v-else>Your list is empty</p>
  </div>
</template>

<script>
import dbClient from '../services/dbCalls'
import Firebase from '../firebase'
import { mapGetters } from 'vuex'

export default {
  name: 'UserWatchList',
  data() {
    return {
      userWatchList: []
    }
  },
  computed: {
    ...mapGetters(['getUID'])
  },
  methods: {
    async getWatchList() {
      const watchListTitles = await dbClient.getUsersWatchList(this.getUID)
      this.userWatchList = watchListTitles
    }
  },
  created() {
    Firebase.auth.onAuthStateChanged(() => {
      this.getWatchList()
    })
  }
}
</script>

<style></style>
