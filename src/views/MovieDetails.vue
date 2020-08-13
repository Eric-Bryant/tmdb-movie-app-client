<template>
  <div>
    <div v-if="movieExists">
      <p>{{ movie.title }}</p>
      <img :src="moviePoster" v-if="movie.poster_path" />
      <p>{{ movie.overview }}</p>
      <AddRemoveButton v-if="loggedIn" :onList="onList" :mediaInfo="movie" />
    </div>
    <div v-else>
      <p>Movie Not Found</p>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import AddRemoveButton from '../components/AddRemoveButton'
import apiClient from '../services/apiCalls'

export default {
  name: 'MovieDetails',
  components: {
    AddRemoveButton
  },
  data() {
    return {
      movie: {},
      movieExists: false,
      onList: false
    }
  },
  computed: {
    ...mapGetters(['getUID', 'loggedIn', 'getWatchList']),
    moviePoster() {
      return `https://image.tmdb.org/t/p/w500/${this.movie.poster_path}`
    },
    watchListStatus() {
      return this.getWatchList.length
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
            if (this.loggedIn) {
              this.onList = this.getWatchList.some(mediaItem => {
                const watchListMediaId = Object.keys(mediaItem).join()
                return this.movie.id == watchListMediaId
              })
            }
          }
        })
        .catch(error => {
          console.log(error)
          this.movieExists = false
        })
    },
    watchListStatus() {
      if (this.loggedIn) {
        this.onList = this.getWatchList.some(mediaItem => {
          const watchListMediaId = Object.keys(mediaItem).join()
          return this.movie.id == watchListMediaId
        })
      }
    }
  },
  created() {
    apiClient
      .getMovieDetails(this.$route.params.id)
      .then(response => {
        if (response.status == 200) {
          this.movie = response.data
          this.movieExists = true
          if (this.loggedIn) {
            this.onList = this.getWatchList.some(mediaItem => {
              const watchListMediaId = Object.keys(mediaItem).join()
              return this.movie.id == watchListMediaId
            })
          }
        } else {
          console.log('error getting movie details')
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
