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
    mediaInfo: {
      type: Object,
      default: function() {
        return {}
      },
      required: true
    }
  },
  data() {
    return {
      onList: false
    }
  },
  watch: {
    getLists: {
      deep: true,
      immediate: true,
      handler: 'checkIfOnList'
    }
  },
  computed: {
    ...mapGetters(['getUID', 'getLists'])
  },
  methods: {
    addToWatchList() {
      dbClient.addMediaToWatchList(this.getUID, this.mediaInfo)
    },
    removeFromWatchList() {
      dbClient.removeMediaFromWatchList(this.getUID, this.mediaInfo.id)
    },
    addToWatched() {
      dbClient.addToWatchedList(this.getUID, this.mediaInfo)
    },
    checkIfOnList() {
      const lists = []
      for (let key in this.getLists) {
        lists.push(this.getLists[key])
      }

      this.onList = false

      lists.map(list => {
        if (list.onList[this.mediaInfo.id]) {
          this.onList = true
        }
      })
    }
  }
}
</script>

<style></style>
