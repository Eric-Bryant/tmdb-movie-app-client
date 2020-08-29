<template>
  <v-container>
    <v-skeleton-loader type="card-heading" v-if="loading && loggedIn" />
    <h1 class="mb-2" v-else>
      Hi {{ loggedIn ? getDisplayName : 'Anonymous' }}!
    </h1>
    <div v-if="loggedIn">
      <v-skeleton-loader type="card-heading" v-if="loading" />
      <h2 v-else>Your Lists</h2>
      <BaseLoadingListSkeleton v-if="loading" :amount="3" />
      <v-row v-else-if="userLists.length > 0 && !loading">
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
      <v-skeleton-loader type="card-heading" v-if="loading" />
      <h2 v-else>Recommendations For You</h2>
      <MediaRecommendations />
    </div>
  </v-container>
</template>

<script>
import { mapGetters } from 'vuex'
import ListCard from '../components/ListCard'
import BaseLoadingListSkeleton from '../components/BaseLoadingListSkeleton'
import MediaRecommendations from '../components/MediaRecommendations'

export default {
  name: 'Home',
  components: {
    ListCard,
    BaseLoadingListSkeleton,
    MediaRecommendations
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
