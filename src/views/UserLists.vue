<template>
  <v-container>
    <v-skeleton-loader type="card-heading" v-if="loading" />
    <h1 v-else>Your Lists</h1>
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
  </v-container>
</template>

<script>
import { mapGetters } from 'vuex'
import ListCard from '../components/ListCard'
import BaseLoadingListSkeleton from '../components/BaseLoadingListSkeleton'

export default {
  name: 'UserLists',
  components: {
    BaseLoadingListSkeleton,
    ListCard
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
    ...mapGetters(['getUID', 'getLists'])
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

<style></style>
