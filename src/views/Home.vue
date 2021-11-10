<template>
  <v-container v-if="!loading && loggedIn">
    <h1 class="mb-5">Hi {{ getDisplayName }}!</h1>
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
  <v-container fill-height class="justify-center" v-else-if="loading">
    <div class="d-flex align-center flex-column">
      <h1 class="mb-2 text-uppercase text-center">Loading...</h1>
      <BaseLoadingRoller />
    </div>
  </v-container>
  <v-container fill-height class="justify-center" v-else>
    <div class="d-flex align-center flex-column">
      <h1 class="mb-2 text-center">Welcome to My Media Lists</h1>
      <p class="text-center">
        Search for your favorite movie, show, actor, actress, or director.
        Account required to create and manage lists.
      </p>
      <div class="d-flex align-center justify-center">
        <v-btn color="primary" :to="{ name: 'Login' }">Log In</v-btn>
        <v-btn color="primary" class="ml-2" :to="{ name: 'CreateAccount' }"
          >Sign Up</v-btn
        >
      </div>
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
