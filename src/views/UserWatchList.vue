<template>
  <div v-if="!loading && parsedWatchList.length > 0">
    <v-container>
      <h1>Your Watch List</h1>
      <v-row>
        <MediaCard
          v-for="media in parsedWatchList"
          :key="media.id"
          :mediaInfo="media"
        />
      </v-row>
    </v-container>
  </div>
  <v-container
    v-else-if="!loading & (parsedWatchList.length == 0)"
    fill-height
    class="justify-center"
  >
    <div class="align-center">
      <h1 class="text-uppercase">Your List is Empty</h1>
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
import MediaCard from '../components/MediaCard'
import { mapGetters } from 'vuex'
import LoadingRoller from '../components/LoadingRoller'

export default {
  name: 'UserWatchList',
  components: {
    MediaCard,
    LoadingRoller
  },
  data() {
    return {
      userWatchList: [],
      loading: false
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
  }
}
</script>

<style></style>
