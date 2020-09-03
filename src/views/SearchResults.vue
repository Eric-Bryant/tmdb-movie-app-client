<template>
  <v-container v-if="searchResults.length > 0">
    <h1>Search Results For: {{ searchQuery }}</h1>
    <v-select
      v-model="searchType"
      dense
      :items="['All', 'Movies', 'TV', 'People']"
      prefix="Filter By: "
      outlined
      @change="filterResultByType"
      hide-details
    ></v-select>
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
    <div class="text-center my-8">
      <v-pagination
        v-model="currentPage"
        :length="totalPages"
        total-visible="10"
        @input="changePage"
      ></v-pagination>
    </div>
  </v-container>
  <v-container
    fill-height
    class="justify-center"
    v-else-if="!loading && searchResults.length == 0"
  >
    <div class="align-center">
      <h1 class="text-uppercase">No results found for {{ searchQuery }}.</h1>
    </div>
  </v-container>
  <v-container fill-height class="justify-center" v-else>
    <div class="d-flex align-center flex-column">
      <h1 class="mb-2 text-uppercase text-center">Loading details...</h1>
      <BaseLoadingRoller />
    </div>
  </v-container>
</template>

<script>
import MediaCard from '../components/MediaCard'
import apiClient from '../services/apiCalls'
import BaseLoadingRoller from '../components/BaseLoadingRoller'
export default {
  name: 'SearchResults',
  components: {
    MediaCard,
    BaseLoadingRoller
  },
  data() {
    return {
      searchQuery: '',
      searchResults: [],
      searchType: '',
      totalPages: '',
      currentPage: 1,
      loading: true,
      genre: ''
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
      this.setTitleTag()
      this.searchForQuery()
    }
  },
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
    },
    filterResultByType() {
      this.$router.push(`/search/${this.searchQuery}/?type=${this.searchType}`)
    },
    changePage() {
      this.$router.push(
        `/search/${this.searchQuery}/?page=${this.currentPage}&type=${this.searchType}`
      )
    },
    setTitleTag() {
      document.title = `Search results for ${this.searchQuery} | Page ${this.currentPage} | My Media Lists`
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
    this.setTitleTag()
    this.searchForQuery()
  }
}
</script>

<style lang="scss" scoped></style>
