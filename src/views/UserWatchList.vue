<template>
  <div v-if="!loading && userWatchList.length > 0">
    <v-container>
      <h1>Your Watch List</h1>
      <v-row> </v-row>
    </v-container>
  </div>
  <v-container
    v-else-if="!loading & (userWatchList.length == 0)"
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
      <BaseLoadingRoller />
    </div>
  </v-container>
</template>

<script>
import { mapGetters } from 'vuex'
import BaseLoadingRoller from '../components/BaseLoadingRoller'
import dbClient from '../services/dbCalls'

export default {
  name: 'UserWatchList',
  components: {
    BaseLoadingRoller
  },
  data() {
    return {
      userWatchList: [],
      loading: false
    }
  },
  computed: {
    ...mapGetters(['getUID'])
  },
  created() {
    dbClient.getUserWatchList(this.getUID).then(watchList => {
      this.userWatchList = watchList
    })
  }
}
</script>

<style></style>
