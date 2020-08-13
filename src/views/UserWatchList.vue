<template>
  <div>
    <h1>Your Watch List</h1>
    <v-row v-if="parsedWatchList.length > 0">
      <MediaCard
        v-for="media in parsedWatchList"
        :key="media.title"
        :mediaInfo="media"
      />
    </v-row>
    <p v-else>Your list is empty</p>
  </div>
</template>

<script>
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
    ...mapGetters(['getUID', 'getWatchList']),
    parsedWatchList() {
      return this.getWatchList.map(mediaItem => {
        const watchListMediaId = Object.keys(mediaItem).join()
        return mediaItem[watchListMediaId]
      })
    }
  },
  methods: {},
  created() {}
}
</script>

<style></style>
