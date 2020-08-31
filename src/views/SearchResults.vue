<template>
  <v-container>
    <h1>Search Results For: {{ searchQuery }}</h1>
    <p>Page: {{ currentPage }} of {{ totalPages }}</p>
    <v-btn
      v-if="currentPage - 1 != 0"
      :to="`/search/${searchQuery}/?page=${currentPage - 1}`"
      >Previous Page</v-btn
    >
    <v-btn
      v-if="currentPage + 1 <= totalPages"
      :to="`/search/${searchQuery}/?page=${currentPage + 1}`"
      >Next Page</v-btn
    >
    <p v-for="result in searchResults" :key="result.id">
      {{ result.title || result.name }}
    </p>
  </v-container>
</template>

<script>
import apiClient from '../services/apiCalls'
export default {
  name: 'SearchResults',
  data() {
    return {
      searchQuery: '',
      searchResults: [],
      totalPages: '',
      currentPage: 1
    }
  },
  watch: {
    $route(to, from) {
      if (to.query.page) {
        this.currentPage = parseInt(to.query.page)
      } else {
        this.currentPage = 1
      }
      this.searchQuery = to.params.searchQuery

      apiClient.searchMulti(this.searchQuery, this.currentPage).then(result => {
        this.totalPages = result.data.total_pages
        this.searchResults = result.data.results
      })
    }
  },
  computed: {},
  methods: {},
  created() {
    this.searchQuery = this.$route.params.searchQuery
    apiClient.searchMulti(this.searchQuery).then(result => {
      this.totalPages = result.data.total_pages
      this.searchResults = result.data.results
    })
    if (this.$route.query.page) {
      this.currentPage = parseInt(this.$route.query.page)
    }
  }
}
</script>

<style lang="scss" scoped></style>
