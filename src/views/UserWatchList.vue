<template>
  <div>
    <h1>Your Watch List</h1>
    <v-layout v-if="userWatchList.length > 0">
      <MediaCard
        v-for="media in userWatchList"
        :key="media.title"
        :mediaInfo="media"
        @removeFromList="removeFromList($event)"
      />
    </v-layout>
    <p v-else>Your list is empty</p>
  </div>
</template>

<script>
import dbClient from '../services/dbCalls'
import apiClient from '../services/apiCalls'
import MediaCard from '../components/MediaCard'
import { mapGetters } from 'vuex'

export default {
  name: 'UserWatchList',
  components: {
    MediaCard
  },
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
      dbClient.getUsersWatchList(this.getUID).then(watchList => {
        watchList.map(id => {
          apiClient.getMovieDetails(id).then(result => {
            this.userWatchList.push(result.data)
          })
        })
      })
    },
    removeFromList(mediaInfo) {
      this.userWatchList = this.userWatchList.filter(val => {
        return val.id != mediaInfo.id
      })
    }
  },
  created() {
    this.getWatchList()
  }
}
</script>

<style></style>
