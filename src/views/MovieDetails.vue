<template>
  <!-- Loading done & movie exists -->
  <div v-if="movieExists && !loadingDetails">
    <v-container class="d-xs-block d-sm-none trailer-container">
      <MediaTrailer
        mediaType="Movie"
        :mediaID="movie.id"
        width="100%"
        height="315"
      />
    </v-container>
    <div class="details-container">
      <v-container>
        <v-slide-group
          v-if="movie.genres.length > 0"
          class="pt-2 d-xs-block d-sm-none"
        >
          <v-slide-item v-for="genre in movie.genres" :key="genre.id">
            <v-chip
              :to="`/genre/${genre.id}`"
              color="secondary"
              class="mr-2 mb-2 genre-chips"
              >{{ genre.name }}</v-chip
            >
          </v-slide-item>
        </v-slide-group>
        <v-row>
          <v-col cols="5" sm="3"
            ><v-img :src="moviePoster" v-if="movie.poster_path"
          /></v-col>
          <v-col cols="7" sm="9">
            <v-slide-group
              v-if="movie.genres.length > 0"
              class="mt-2 mt-sm-0 d-none d-sm-block"
            >
              <v-slide-item v-for="genre in movie.genres" :key="genre.id">
                <v-chip
                  :to="`/genre/${genre.id}`"
                  color="secondary"
                  class="mr-2 mb-2 genre-chips"
                  >{{ genre.name }}</v-chip
                >
              </v-slide-item>
            </v-slide-group>
            <h1 class="movie-title">
              {{ movie.title }}
              <sup class="text-caption"
                >({{
                  movie.release_date ? movie.release_date.split('-')[0] : 'N/A'
                }})</sup
              >
            </h1>
            <p class="movie-overview">{{ movie.overview }}</p>
            <MediaCredits :mediaID="movie.id" mediaType="Movie" />
            <div class="d-flex align-center">
              <v-progress-circular
                :color="movieRating"
                rotate="270"
                size="64"
                width="5"
                :value="movie.vote_average * 10"
                >{{ movie.vote_average * 10 }}%</v-progress-circular
              >
              <AddRemoveButton
                class="ml-2"
                v-if="loggedIn"
                :onList="onList"
                :mediaInfo="movie"
                rounded="true"
                @added="onList = true"
                @removed="onList = false"
              />
            </div>
          </v-col>
        </v-row>
      </v-container>
    </div>
  </div>
  <!-- Loading done & Movie not found -->
  <v-container
    fill-height
    class="justify-center"
    v-else-if="!loadingDetails && !movieExists"
  >
    <div class="align-center">
      <h1 class="text-uppercase">Movie Not Found</h1>
    </div>
  </v-container>
  <!-- Loading -->
  <v-container fill-height class="justify-center" v-else>
    <div class="d-flex align-center flex-column">
      <h1 class="mb-2 text-uppercase">Loading details...</h1>
      <LoadingRoller />
    </div>
  </v-container>
</template>

<script>
import { mapGetters } from 'vuex'
import AddRemoveButton from '../components/AddRemoveButton'
import apiClient from '../services/apiCalls'
import dbClient from '../services/dbCalls'
import MediaTrailer from '../components/MediaTrailer'
import MediaCredits from '../components/MediaCredits'
import LoadingRoller from '../components/LoadingRoller'

export default {
  name: 'MovieDetails',
  components: {
    AddRemoveButton,
    MediaTrailer,
    MediaCredits,
    LoadingRoller
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
    ...mapGetters(['getUID', 'loggedIn']),
    moviePoster() {
      return `https://image.tmdb.org/t/p/w500/${this.movie.poster_path}`
    },
    movieRating() {
      if (this.movie.vote_average < 5) {
        return 'red'
      } else if (this.movie.vote_average < 8) {
        return 'warning'
      } else {
        return 'success'
      }
    }
  },
  watch: {
    $route(to, from) {
      this.loadingDetails = true
      this.getMovieDetails(to.params.id)
    }
  },
  methods: {
    getMovieDetails(mediaID) {
      apiClient
        .getMovieDetails(mediaID)
        .then(response => {
          if (response.status == 200) {
            this.movie = response.data
            this.movieExists = true
            if (this.loggedIn) {
              dbClient
                .checkIfMediaOnList(this.getUID, mediaID)
                .then(isOnList => {
                  this.onList = isOnList
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
  },
  created() {
    this.getMovieDetails(this.$route.params.id)
  }
}
</script>

<style lang="scss" scoped>
.container {
  padding: 0;

  @media screen and (min-width: 600px) {
    padding: 0 1rem;
  }
}

.details-container {
  padding-left: 1rem;
  padding-right: 1rem;
  background: #efefef;

  @media screen and (min-width: 600px) {
    padding: 1rem 0;
  }
}

.trailer-container {
  height: 315px;
}

.genre-chips {
  &:first-child {
    margin-left: 0px !important;
  }

  &:last-child {
    margin-right: 0px !important;
  }
}

.movie-title {
  font-size: 1.25em;

  @media screen and (min-width: 600px) {
    font-size: 2em;
  }
}

.movie-overview {
  font-size: 0.875em;

  @media screen and (min-width: 600px) {
    font-size: 1em;
  }
}
</style>
