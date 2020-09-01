<template>
  <v-container>
    <div v-if="searchResults.length > 0">
      <h1>Search Results For: {{ searchQuery }}</h1>
      <p>Page: {{ currentPage }} of {{ totalPages }}</p>
      <v-btn
        v-if="currentPage - 1 != 0"
        :to="
          `/search/${searchQuery}/?page=${currentPage - 1}&type=${searchType}`
        "
        >Previous Page</v-btn
      >
      <v-btn
        v-if="currentPage + 1 <= totalPages"
        :to="
          `/search/${searchQuery}/?page=${currentPage + 1}&type=${searchType}`
        "
        >Next Page</v-btn
      >
      <v-row no-gutters v-if="!loading">
        <v-col cols="4" sm="2" v-for="title in searchResults" :key="title.id">
          <MediaCard
            width="185px"
            height="250px"
            :media="title"
            class="d-none d-sm-block"
          />
          <MediaCard
            width="100px"
            height="115px"
            :media="title"
            class="d-block d-sm-none"
          />
        </v-col>
      </v-row>
    </div>
    <div v-else-if="!loading && searchResults.length == 0">
      No results found for {{ searchQuery }}.
    </div>
    <div v-else>
      Loading
    </div>
  </v-container>
</template>

<script>
import MediaCard from '../components/MediaCard'
import apiClient from '../services/apiCalls'
export default {
  name: 'SearchResults',
  components: {
    MediaCard
  },
  data() {
    return {
      searchQuery: '',
      searchResults: [],
      searchType: '',
      totalPages: '',
      currentPage: 1,
      loading: true
    }
  },
  watch: {
    $route(to, from) {
      this.loading = true
      if (to.query.page) {
        this.currentPage = parseInt(to.query.page)
      } else {
        this.currentPage = 1
      }
      this.searchQuery = to.params.searchQuery

      if (to.query.type) {
        this.searchType = to.query.type
      } else {
        this.searchType = 'All'
      }

      this.searchForQuery()
    }
  },
  computed: {},
  methods: {
    searchForQuery() {
      if (this.searchType === 'Movies') {
        apiClient
          .searchMovie(this.searchQuery, this.currentPage)
          .then(result => {
            this.totalPages = result.data.total_pages
            this.searchResults = result.data.results
            this.loading = false
          })
      } else if (this.searchType === 'TV') {
        apiClient.searchTV(this.searchQuery, this.currentPage).then(result => {
          this.totalPages = result.data.total_pages
          this.searchResults = result.data.results
          this.loading = false
        })
      } else if (this.searchType === 'People') {
        apiClient
          .searchPerson(this.searchQuery, this.currentPage)
          .then(result => {
            this.totalPages = result.data.total_pages
            this.searchResults = result.data.results
            this.loading = false
          })
      } else {
        apiClient
          .searchMulti(this.searchQuery, this.currentPage)
          .then(result => {
            this.totalPages = result.data.total_pages
            this.searchResults = result.data.results
            this.loading = false
          })
      }
    }
  },
  created() {
    this.searchQuery = this.$route.params.searchQuery

    if (this.$route.query.page) {
      this.currentPage = parseInt(this.$route.query.page)
    }

    if (this.$route.query.type) {
      this.searchType = this.$route.query.type
    } else {
      this.searchType = 'All'
    }

    this.searchForQuery()
  }
}
</script>

<style lang="scss" scoped></style>
