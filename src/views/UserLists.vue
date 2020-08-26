<template>
  <v-container>
    <v-skeleton-loader type="card-heading" v-if="loading" />
    <h1 v-else>Your Lists</h1>
    <LoadingListSkeleton v-if="loading" :amount="3" />
    <v-row v-else-if="userLists.length > 0 && !loading">
      <v-col
        cols="12"
        sm="6"
        md="4"
        v-for="list in userLists"
        :key="list.index"
      >
        <ListCard :list="list" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import dbClient from '../services/dbCalls'
import { mapGetters } from 'vuex'
import ListCard from '../components/ListCard'
import LoadingListSkeleton from '../components/LoadingListSkeleton'

export default {
  name: 'UserLists',
  components: {
    LoadingListSkeleton,
    ListCard
  },
  data() {
    return {
      userLists: [],
      loading: true
    }
  },
  computed: {
    ...mapGetters(['getUID'])
  },
  methods: {
    async getLists() {
      const lists = await dbClient.getUsersLists(this.getUID)
      this.userLists = lists
      this.loading = false
    }
  },
  created() {
    this.getLists()
  }
}
</script>

<style></style>
