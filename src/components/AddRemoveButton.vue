<template>
  <v-btn v-if="onList" @click="removeFromWatchList">Remove</v-btn>
  <v-btn v-else @click="addToWatchList">Add</v-btn>
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
      dbClient.addMediaToWatchList(
        this.getUID,
        this.mediaInfo.id,
        this.mediaInfo.title
      )

      this.$emit('addedToList', this.mediaInfo)
    },
    removeFromWatchList() {
      dbClient.removeMediaFromWatchList(this.getUID, this.mediaInfo.id)

      this.$emit('removedFromList', this.mediaInfo)
    }
  }
}
</script>

<style></style>
