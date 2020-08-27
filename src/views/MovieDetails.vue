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
        <GenreChips :movie="movie" class="pt-2 d-xs-block d-sm-none" />
        <v-row class="details-row">
          <v-col cols="12" sm="3"
            ><v-img :src="moviePoster" v-if="movie.poster_path"
          /></v-col>
          <v-col cols="12" sm="9" style="z-index: 1">
            <GenreChips :movie="movie" class="mt-2 mt-sm-0 d-none d-sm-block" />

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
      <MediaCarouselCards
        :info="movieCast"
        :mobile="false"
        class="d-none d-sm-flex"
      />
      <MediaCarouselCards
        :info="movieCast"
        :mobile="true"
        class="d-flex d-sm-none"
      />
    </v-container>
    <!-- Similar Movies Section -->
    <v-container class="py-4 mb-9">
      <h2 class="cast-heading text-center mb-5">Similar Films</h2>
      <MediaCarouselCards
        :info="similarMovies"
        :mobile="false"
        class="d-none d-sm-flex"
      />
      <!-- Mobile Only -->
      <MediaCarouselCards
        :info="similarMovies"
        :mobile="true"
        class="d-flex d-sm-none"
      />
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
      <BaseLoadingRoller />
    </div>
  </v-container>
</template>

<script>
import { mapGetters } from 'vuex'
import AddRemoveButton from '../components/AddRemoveButton'
import apiClient from '../services/apiCalls'
import dbClient from '../services/dbCalls'
import BaseLoadingRoller from '../components/BaseLoadingRoller'
import GenreChips from '../components/GenreChips'
import MediaCarouselCards from '../components/MediaCarouselCards'

export default {
  name: 'MovieDetails',
  components: {
    AddRemoveButton,
    BaseLoadingRoller,
    GenreChips,
    MediaCarouselCards
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
        .then(async response => {
          if (response.status == 200) {
            this.movie = response.data
            this.movieExists = true
            if (this.loggedIn) {
              this.onList = await dbClient.checkIfMediaOnList(
                this.getUID,
                mediaID
              )
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
</style>
