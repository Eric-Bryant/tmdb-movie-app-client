<template>
  <v-container>
    <h1>Your Lists</h1>
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
  </v-container>
</template>

<script>
import { mapGetters } from 'vuex'
import ListCard from '../components/ListCard'

export default {
  name: 'UserLists',
  components: {
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
