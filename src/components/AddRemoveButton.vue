<template>
  <v-btn v-if="onList" @click="removeFromWatchList" color="warning"
    >Remove</v-btn
  >
  <v-btn v-else @click="addToWatchList" color="primary"
    >Add To Watch List</v-btn
  >
</template>

<script>
import dbClient from '../services/dbCalls'
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'AddRemoveButton',
  props: {
    onList: {
      type: Boolean,
      default: false,
      required: true
    },
    mediaInfo: {
      type: Object,
      default: function() {
        return {}
      },
      required: true
    }
  },
  computed: {
    ...mapGetters(['getUID'])
  },
  methods: {
    ...mapActions(['addMediaToWatchList', 'removeMediaFromWatchList']),
    addToWatchList() {
      dbClient.addMediaToWatchList(this.getUID, this.mediaInfo)
      this.addMediaToWatchList(this.mediaInfo)
    },
    removeFromWatchList() {
      dbClient.removeMediaFromWatchList(this.getUID, this.mediaInfo.id)
      this.removeMediaFromWatchList(this.mediaInfo)
    }
  }
}
</script>

<style></style>
