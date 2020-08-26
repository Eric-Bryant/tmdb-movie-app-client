<template>
  <div v-if="onList">
    <v-btn @click="removeFromWatchList" color="error">Remove</v-btn>
    <v-btn @click="addToWatched" color="accent" class="ml-2">Watched</v-btn>
  </div>
  <v-btn v-else @click="addToWatchList" color="accent">Add To Watch List</v-btn>
</template>

<script>
import dbClient from '../services/dbCalls'
import { mapGetters } from 'vuex'

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
    addToWatchList() {
      dbClient.addMediaToWatchList(this.getUID, this.mediaInfo)
      this.$emit('added')
    },
    removeFromWatchList() {
      dbClient.removeMediaFromWatchList(this.getUID, this.mediaInfo.id)
      this.$emit('removed')
    },
    addToWatched() {
      dbClient.addToWatchedList(this.getUID, this.mediaInfo)
      this.$emit('removed')
    }
  }
}
</script>

<style></style>
