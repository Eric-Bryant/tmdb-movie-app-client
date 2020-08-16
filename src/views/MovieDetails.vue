<template>
  <v-container
    :fill-height="loadingDetails || !movieExists"
    :class="{ 'justify-center': loadingDetails || !movieExists }"
  >
    <div v-if="!loadingDetails">
      <MediaTrailer
        mediaType="Movie"
        :mediaID="movie.id"
        width="100%"
        height="315"
      />
      <v-row v-if="movieExists" no-gutters>
        <v-col cols="12" sm="3" class="pa-xs-0 pr-sm-4"
          ><v-img :src="moviePoster" v-if="movie.poster_path"
        /></v-col>
        <v-col cols="12" sm="9" class="pa-xs-0 px-sm-4">
          <div v-if="movie.genres.length > 0" class="mt-2 mt-sm-0">
            <v-chip
              v-for="genre in movie.genres"
              :key="genre.id"
              :to="`/genre/${genre.id}`"
              color="secondary"
              class="mr-2 mb-2 genre-chips"
              >{{ genre.name }}</v-chip
            >
          </div>
          <h1>
            {{ movie.title }} ({{
              movie.release_date ? movie.release_date.split('-')[0] : 'N/A'
            }})
          </h1>
          <p>{{ movie.overview }}</p>
          <AddRemoveButton
            v-if="loggedIn"
            :onList="onList"
            :mediaInfo="movie"
          />
        </v-col>
      </v-row>
      <div v-else class="align-center">
        <h1 class="text-uppercase">Movie Not Found</h1>
      </div>
    </div>
    <div v-else class="d-flex align-center flex-column">
      <h1 class="mb-2 text-uppercase">Loading details...</h1>
      <div class="lds-roller">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </div>
  </v-container>
</template>

<script>
import { mapGetters } from 'vuex'
import AddRemoveButton from '../components/AddRemoveButton'
import apiClient from '../services/apiCalls'
import MediaTrailer from '../components/MediaTrailer'

export default {
  name: 'MovieDetails',
  components: {
    AddRemoveButton,
    MediaTrailer
  },
  data() {
    return {
      movie: {},
      movieExists: false,
      onList: false,
      loadingDetails: true
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
      this.loadingDetails = true
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
          this.loadingDetails = false
          this.movieExists = false
        })
        .finally(() => {
          this.loadingDetails = false
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
      .finally(() => {
        this.loadingDetails = false
      })
  }
}
</script>

<style lang="scss" scoped>
.genre-chips {
  &:first-child {
    margin-left: 0px !important;
  }

  &:last-child {
    margin-right: 0px !important;
  }
}
</style>
