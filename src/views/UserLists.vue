<template>
  <div>
    <h1>Your Lists</h1>
    <div v-if="userLists.length > 0">
      <p v-for="list in userLists" :key="list.index">
        <v-btn :to="{ name: 'UserWatchList' }"> {{ list }}</v-btn>
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
  name: 'UserLists',
  data() {
    return {
      userLists: []
    }
  },
  computed: {
    ...mapGetters(['getUID'])
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

<style></style>
