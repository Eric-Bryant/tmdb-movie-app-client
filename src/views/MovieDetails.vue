<template>
  <div>
    <div v-if="movieExists">
      <p>{{ movie.title }}</p>
      <img :src="moviePoster" v-if="movie.poster_path" />
      <p>{{ movie.overview }}</p>
    </div>
    <div v-else>
      <p>Movie Not Found</p>
    </div>
  </div>
</template>

<script>
import apiClient from '../services/apiCalls'

export default {
  name: 'MovieDetails',
  data() {
    return {
      movie: {},
      movieExists: false
    }
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      apiClient
        .getMovieDetails(to.params.id)
        .then(response => {
          if (response.status == 200) {
            vm.movie = response.data
            vm.movieExists = true
          }
        })
        .catch(error => {
          console.log(error)
          vm.movieExists = false
        })
    })
  },
  beforeRouteUpdate(to, from, next) {
    apiClient
      .getMovieDetails(to.params.id)
      .then(response => {
        if (response.status == 200) {
          this.movie = response.data
          this.movieExists = true
        }
      })
      .catch(error => {
        console.log(error)
        this.movieExists = false
      })
  },
  computed: {
    moviePoster() {
      return `https://image.tmdb.org/t/p/w500/${this.movie.poster_path}`
    }
  }
}
</script>

<style></style>
