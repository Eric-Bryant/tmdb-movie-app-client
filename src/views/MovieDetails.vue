<template>
  <!-- Loading done & movie exists -->
  <div v-if="movieExists && !loadingDetails">
    <v-container
      class="d-xs-block d-sm-none trailer-container"
      v-if="mediaVideos"
      ><iframe
        width="100%"
        height="215"
        :src="`https://www.youtube.com/embed/${youtubeID}`"
        frameborder="0"
        allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
        allowfullscreen
      ></iframe>
    </v-container>
    <div class="details-container" :style="{ background: detailsBackground }">
      <div class="overlay"></div>
      <v-container>
        <v-slide-group
          v-if="movie.genres.length > 0"
          class="pt-2 d-xs-block d-sm-none"
        >
          <v-slide-item v-for="genre in movie.genres" :key="genre.id">
            <v-chip
              :to="`/genre/${genre.id}`"
              color="secondary"
              class="mr-2 genre-chips"
              >{{ genre.name }}</v-chip
            >
          </v-slide-item>
        </v-slide-group>
        <v-row class="details-row">
          <v-col cols="12" sm="3"
            ><v-img :src="moviePoster" v-if="movie.poster_path"
          /></v-col>
          <v-col cols="12" sm="9" style="z-index: 1">
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
            <p class="director">
              Director:
              <router-link :to="`/person/${movieDirector.id}`">{{
                movieDirector.name
              }}</router-link>
            </p>
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
    <!-- Cast Section -->
    <v-container class="py-4">
      <h2 class="cast-heading text-center my-5">Cast</h2>
      <v-slide-group>
        <v-slide-item v-for="person in movieCast" :key="person.id">
          <v-card max-width="185" class="ma-2">
            <router-link :to="`/person/${person.id}`" exact>
              <v-img
                v-if="person.profile_path"
                :src="`https://image.tmdb.org/t/p/w185/${person.profile_path}`"
                height="250px"
              ></v-img>
              <v-img
                v-else
                src="data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22250%22%20height%3D%22185%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20250%20185%22%20preserveAspectRatio%3D%22none%22%3E%0A%20%20%20%20%20%20%3Cdefs%3E%0A%20%20%20%20%20%20%20%20%3Cstyle%20type%3D%22text%2Fcss%22%3E%0A%20%20%20%20%20%20%20%20%20%20%23holder%20text%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20fill%3A%20transparent%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20font-family%3A%20sans-serif%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20font-size%3A%2040px%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20font-weight%3A%20400%3B%0A%20%20%20%20%20%20%20%20%20%20%7D%0A%20%20%20%20%20%20%20%20%3C%2Fstyle%3E%0A%20%20%20%20%20%20%3C%2Fdefs%3E%0A%20%20%20%20%20%20%3Cg%20id%3D%22holder%22%3E%0A%20%20%20%20%20%20%20%20%3Crect%20width%3D%22100%25%22%20height%3D%22100%25%22%20fill%3D%22%23E0E0E0%22%3E%3C%2Frect%3E%0A%20%20%20%20%20%20%20%20%3Cg%3E%0A%20%20%20%20%20%20%20%20%20%20%3Ctext%20text-anchor%3D%22middle%22%20x%3D%2250%25%22%20y%3D%2250%25%22%20dy%3D%22.3em%22%3E250%20x%20185%3C%2Ftext%3E%0A%20%20%20%20%20%20%20%20%3C%2Fg%3E%0A%20%20%20%20%20%20%3C%2Fg%3E%0A%20%20%20%20%3C%2Fsvg%3E"
                height="250px"
              ></v-img>
            </router-link>
            <v-card-title class="cast-name">{{ person.name }}</v-card-title>
          </v-card>
        </v-slide-item>
      </v-slide-group>
    </v-container>
    <!-- Similar Movies Section -->
    <v-container class="py-4">
      <h2 class="cast-heading text-center mb-5">Similar Films</h2>
      <v-slide-group>
        <v-slide-item v-for="movie in similarMovies" :key="movie.id">
          <v-card max-width="185" class="ma-2">
            <router-link :to="`/movie/${movie.id}`" exact>
              <v-img
                v-if="movie.poster_path"
                :src="`https://image.tmdb.org/t/p/w185/${movie.poster_path}`"
                height="250px"
              ></v-img>
              <v-img
                v-else
                src="data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22250%22%20height%3D%22185%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20250%20185%22%20preserveAspectRatio%3D%22none%22%3E%0A%20%20%20%20%20%20%3Cdefs%3E%0A%20%20%20%20%20%20%20%20%3Cstyle%20type%3D%22text%2Fcss%22%3E%0A%20%20%20%20%20%20%20%20%20%20%23holder%20text%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20fill%3A%20transparent%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20font-family%3A%20sans-serif%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20font-size%3A%2040px%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20font-weight%3A%20400%3B%0A%20%20%20%20%20%20%20%20%20%20%7D%0A%20%20%20%20%20%20%20%20%3C%2Fstyle%3E%0A%20%20%20%20%20%20%3C%2Fdefs%3E%0A%20%20%20%20%20%20%3Cg%20id%3D%22holder%22%3E%0A%20%20%20%20%20%20%20%20%3Crect%20width%3D%22100%25%22%20height%3D%22100%25%22%20fill%3D%22%23E0E0E0%22%3E%3C%2Frect%3E%0A%20%20%20%20%20%20%20%20%3Cg%3E%0A%20%20%20%20%20%20%20%20%20%20%3Ctext%20text-anchor%3D%22middle%22%20x%3D%2250%25%22%20y%3D%2250%25%22%20dy%3D%22.3em%22%3E250%20x%20185%3C%2Ftext%3E%0A%20%20%20%20%20%20%20%20%3C%2Fg%3E%0A%20%20%20%20%20%20%3C%2Fg%3E%0A%20%20%20%20%3C%2Fsvg%3E"
                height="250px"
              ></v-img>
            </router-link>
            <v-card-title class="cast-name">{{ movie.title }}</v-card-title>
          </v-card>
        </v-slide-item>
      </v-slide-group>
    </v-container>
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
import LoadingRoller from '../components/LoadingRoller'

export default {
  name: 'MovieDetails',
  components: {
    AddRemoveButton,
    LoadingRoller
  },
  data() {
    return {
      movie: {},
      movieExists: false,
      mediaCredits: [],
      movieCast: [],
      movieDirector: '',
      mediaVideos: [],
      similarMovies: [],
      youtubeID: '',
      vimeoID: '',
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
        return 'error'
      } else if (this.movie.vote_average < 7) {
        return 'warning'
      } else {
        return 'success'
      }
    },
    detailsBackground() {
      if (this.movie.backdrop_path) {
        return `url(https://image.tmdb.org/t/p/original/${this.movie.backdrop_path}) no-repeat center/cover`
      } else if (this.movie.poster_path) {
        return `url(https://image.tmdb.org/t/p/original/${this.movie.poster_path}) no-repeat center/cover`
      } else {
        return `#efefef`
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

            this.getMovieCredits()
            this.getMovieTrailers()
            this.getSimilarMovies()
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
    },
    getMovieCredits() {
      apiClient.getMovieCredits(this.movie.id).then(result => {
        if (result.data) {
          this.movieCredits = result.data
          this.movieCast = this.movieCredits.cast
          this.movieCredits.crew.map(crewMember => {
            if (crewMember.job == 'Director') {
              this.movieDirector = crewMember
            }
          })
        }
      })
    },
    getMovieTrailers() {
      apiClient.getMovieTrailers(this.movie.id).then(result => {
        if (result.data) {
          this.mediaVideos = result.data
          if (this.mediaVideos.results.length > 1) {
            this.mediaVideos.results.map(video => {
              if (video.type == 'Trailer') {
                this.youtubeID = video.key
              }
            })
          } else if (this.mediaVideos.results.length == 1) {
            this.youtubeID = this.mediaVideos.results[0].key
          } else {
            this.youtubeID = ''
          }
        }
      })
    },
    getSimilarMovies() {
      apiClient.getMovieSimilar(this.movie.id).then(result => {
        if (result.data.results) {
          this.similarMovies = result.data.results
        }
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
  color: white;
  position: relative;

  @media screen and (min-width: 600px) {
    padding: 1rem 0;
  }

  .overlay {
    position: absolute;
    z-index: 0;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.85);
  }

  .details-row {
    flex-direction: column-reverse;

    @media screen and (min-width: 600px) {
      flex-direction: row;
    }
  }
}

.trailer-container {
  line-height: 0;
}

.genre-chips {
  &:first-child {
    margin-left: 0px !important;
  }

  &:last-child {
    margin-right: 0px !important;
  }
}

.movie-title,
.cast-heading {
  font-size: 2em;
}

.movie-overview {
  font-size: 0.875em;

  @media screen and (min-width: 600px) {
    font-size: 1em;
  }
}

.director {
  font-size: 0.875rem;

  a {
    color: #cae9ff;

    &:hover {
      opacity: 0.7;
    }
  }
}

.cast-name {
  word-break: break-word;
}
</style>
