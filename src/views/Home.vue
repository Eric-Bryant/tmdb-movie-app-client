<template>
  <v-container v-if="!loading">
    <h1 class="mb-5">Hi {{ loggedIn ? getDisplayName : 'Anonymous' }}!</h1>
    <div v-if="loggedIn">
      <h2 class="mb-2">Your Lists</h2>
      <v-row>
        <v-col
          cols="12"
          sm="6"
          md="4"
          v-for="(list, index) in userLists"
          :key="index"
        >
          <ListCard :list="list" />
        </v-col>
      </v-row>
      <h2 class="mt-5 mb-2">Recommendations For You</h2>
      <MediaRecommendations />
    </div>
  </v-container>
  <!-- Loading -->
  <v-container fill-height class="justify-center" v-else>
    <div class="d-flex align-center flex-column">
      <h1 class="mb-2 text-uppercase text-center">Loading...</h1>
      <BaseLoadingRoller />
    </div>
  </v-container>
</template>

<script>
import { mapGetters } from 'vuex'
import ListCard from '../components/ListCard'
import MediaRecommendations from '../components/MediaRecommendations'
import BaseLoadingRoller from '../components/BaseLoadingRoller'

export default {
  name: 'Home',
  components: {
    ListCard,
    MediaRecommendations,
    BaseLoadingRoller
  },
  data() {
    return {
      userLists: [],
      loading: true
    }
  },
  watch: {
    getLists: {
      deep: true,
      immediate: true,
      handler: 'getUsersLists'
    }
  },
  computed: {
    ...mapGetters(['getDisplayName', 'loggedIn', 'getUID', 'getLists'])
  },
  methods: {
    getUsersLists() {
      const lists = []
      for (let key in this.getLists) {
        lists.push(this.getLists[key])
      }

      this.userLists = lists
      this.loading = false
    }
  }
}
</script>
