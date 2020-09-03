<template>
  <!-- Loading done & movie exists -->
  <div v-if="movieExists && !loadingDetails">
    <v-container
      class="d-xs-block d-sm-none trailer-container"
      v-if="movieVideos"
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
        <GenreChips :media="movie" class="pt-2 d-xs-block d-sm-none" />
        <v-row class="details-row">
          <v-col cols="12" sm="3"
            ><v-img :src="moviePoster" v-if="movie.poster_path"
          /></v-col>
          <v-col cols="12" sm="9" style="z-index: 1">
            <GenreChips :media="movie" class="mt-2 mt-sm-0 d-none d-sm-block" />

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
                v-if="movie.vote_average > 0"
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
                :mediaInfo="movie"
                rounded="true"
              />
            </div>
          </v-col>
        </v-row>
      </v-container>
    </div>
    <!-- Cast Section -->
    <v-container class="py-4">
      <h2 class="movie-section-heading my-5 text-center">Cast</h2>
      <MediaCarouselCards :info="movieCast" v-if="movieCast.length > 0" />
      <h3 v-else class="text-center">Nothing found.</h3>
      <!-- Similar Movies Section -->
      <h2 class="movie-section-heading my-5 text-center">Similar Films</h2>
      <MediaCarouselCards
        :info="similarMovies"
        v-if="similarMovies.length > 0"
      />
      <h3 v-else class="text-center">Nothing found.</h3>
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
      <h1 class="mb-2 text-uppercase text-center">Loading details...</h1>
      <BaseLoadingRoller />
    </div>
  </v-container>
</template>

<script>
import { mapGetters } from 'vuex'
import AddRemoveButton from '../components/AddRemoveButton'
import apiClient from '../services/apiCalls'
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
      movieCast: [],
      movieDirector: '',
      movieVideos: [],
      similarMovies: [],
      youtubeID: '',
      vimeoID: '',
      loadingDetails: true
    }
  },
  watch: {
    $route(to, from) {
      this.loadingDetails = true
      this.getMovieDetails(to.params.id)
    }
  },
  computed: {
    ...mapGetters(['getUID', 'loggedIn', 'getLists']),
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
  methods: {
    getMovieDetails(mediaID) {
      apiClient
        .getMovieDetails(mediaID)
        .then(async response => {
          if (response.status == 200) {
            this.movie = response.data
            const movieCredits = this.movie.credits
            this.movieCast = movieCredits.cast
            this.similarMovies = this.movie.similar.results
            this.movieVideos = this.movie.videos.results
            this.movieExists = true
            movieCredits.crew.map(crewMember => {
              if (crewMember.job == 'Director') {
                this.movieDirector = crewMember
              }
            })

            if (this.movieVideos.length > 1) {
              this.movieVideos.map(video => {
                if (video.type == 'Trailer') {
                  this.youtubeID = video.key
                }
              })
            } else if (this.movieVideos.length == 1) {
              this.youtubeID = this.movieVideos[0].key
            } else {
              this.youtubeID = ''
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
          document.title = `${this.movie.title} - Details | My Media Lists`
        })
    }
  },
  created() {
    this.getMovieDetails(this.$route.params.id)
  }
}
</script>

<style lang="scss" scoped>
.details-container {
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
  padding: 0;
}

.movie-title,
.movie-section-heading {
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
