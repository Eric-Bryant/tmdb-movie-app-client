<template>
  <div>
    <div v-if="movieExists">
      <p>{{ movie.title }}</p>
      <img :src="moviePoster" v-if="movie.poster_path" />
      <p>{{ movie.overview }}</p>
      <ActionButton :onList="onList ? true : false" />
    </div>
    <div v-else>
      <p>Movie Not Found</p>
    </div>
  </div>
</template>

<script>
import dbClient from '../services/dbCalls'
import { mapGetters } from 'vuex'
import ActionButton from '../components/ActionButton'
import apiClient from '../services/apiCalls'

export default {
  name: 'MovieDetails',
  components: {
    ActionButton
  },
  data() {
    return {
      movie: {},
      movieExists: false,
      onList: ''
    }
  },
  watch: {
    $route(to, from) {
      apiClient
        .getMovieDetails(to.params.id)
        .then(response => {
          if (response.status == 200) {
            this.movie = response.data
            this.movieExists = true
            dbClient.getUsersWatchList(this.getUID).then(watchList => {
              this.onList = watchList.some(id => {
                return this.movie.id == id
              })
            })
          }
        })
        .catch(error => {
          console.log(error)
          this.movieExists = false
        })
    }
  },
  computed: {
    ...mapGetters(['getUID']),
    moviePoster() {
      return `https://image.tmdb.org/t/p/w500/${this.movie.poster_path}`
    }
  },
  created() {
    apiClient
      .getMovieDetails(this.$route.params.id)
      .then(response => {
        if (response.status == 200) {
          this.movie = response.data
          this.movieExists = true
          dbClient.getUsersWatchList(this.getUID).then(watchList => {
            this.onList = watchList.some(id => {
              return this.movie.id == id
            })
          })
        }
      })
      .catch(error => {
        console.log(error)
        this.movieExists = false
      })
  }
}
</script>

<style></style>
