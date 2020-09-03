<template>
  <!-- Loading done & tv exists -->
  <div v-if="personExists && !loadingDetails">
    <div class="details-container" :style="{ background: detailsBackground }">
      <div class="overlay"></div>
      <v-container>
        <v-row>
          <v-col cols="12" sm="3"
            ><v-img :src="personPicture" v-if="person.profile_path"
          /></v-col>
          <v-col cols="12" sm="9" style="z-index: 1">
            <h1 class="person-name">
              {{ person.name }}
            </h1>
            <p class="text-subtitle-1" v-if="person.birthday">
              {{ person.birthday.split('-')[0] }} -
              {{ person.deathday ? person.deathday.split('-')[0] : 'Present' }}
            </p>
            <p class="person-bio">
              {{
                person.biography.length > 0 ? person.biography : 'No biography.'
              }}
            </p>
          </v-col>
        </v-row>
      </v-container>
    </div>
    <!-- Cast Section -->
    <v-container class="py-4">
      <h2 class="tv-section-heading my-5 text-center">Movies Known For</h2>
      <MediaCarouselCards
        :info="moviesKnownFor"
        v-if="moviesKnownFor.length > 0"
      />
      <h3 v-else class="text-center">Nothing found.</h3>
      <!-- Similar Tv Section -->
      <h2 class="tv-section-heading my-5 text-center">Shows Known For</h2>
      <MediaCarouselCards :info="tvKnownFor" v-if="tvKnownFor.length > 0" />
      <h3 v-else class="text-center">Nothing found.</h3>
    </v-container>
  </div>
  <!-- Loading done & tv not found -->
  <v-container
    fill-height
    class="justify-center"
    v-else-if="!loadingDetails && !personExists"
  >
    <div class="align-center">
      <h1 class="text-uppercase">Person Not Found</h1>
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
import apiClient from '../services/apiCalls'
import BaseLoadingRoller from '../components/BaseLoadingRoller'
import MediaCarouselCards from '../components/MediaCarouselCards'

export default {
  name: 'PersonDetails',
  components: {
    BaseLoadingRoller,
    MediaCarouselCards
  },
  data() {
    return {
      person: {},
      personExists: false,
      knownFor: [],
      moviesKnownFor: [],
      tvKnownFor: [],
      loadingDetails: true
    }
  },
  computed: {
    ...mapGetters(['getUID', 'loggedIn']),
    personPicture() {
      return `https://image.tmdb.org/t/p/w500/${this.person.profile_path}`
    },
    detailsBackground() {
      if (this.person.backdrop_path) {
        return `url(https://image.tmdb.org/t/p/original/${this.person.backdrop_path}) no-repeat center/cover`
      } else if (this.person.profile_path) {
        return `url(https://image.tmdb.org/t/p/original/${this.person.profile_path}) no-repeat center/cover`
      } else {
        return `#efefef`
      }
    }
  },
  watch: {
    $route(to, from) {
      this.loadingDetails = true
      this.moviesKnownFor = []
      this.tvKnownFor = []
      this.getPersonDetails(to.params.id)
    }
  },
  methods: {
    getPersonDetails(personID) {
      apiClient
        .getPersonDetails(personID)
        .then(response => {
          if (response.status == 200) {
            this.person = response.data
            this.personExists = true
            const combinedCredits = this.person.combined_credits

            if (this.person.known_for_department === 'Acting') {
              combinedCredits.cast.map(title => {
                if (title.media_type === 'tv') {
                  this.tvKnownFor.push(title)
                } else if (title.media_type === 'movie') {
                  this.moviesKnownFor.push(title)
                }
              })
            } else {
              combinedCredits.crew.map(title => {
                if (title.media_type === 'tv') {
                  this.tvKnownFor.push(title)
                } else if (title.media_type === 'movie') {
                  this.moviesKnownFor.push(title)
                }
              })
            }
          } else {
            console.log('error getting person details')
          }
        })
        .catch(error => {
          console.log(error)
          this.personExists = false
        })
        .finally(() => {
          this.loadingDetails = false
          document.title = `${this.person.name} | My Media Lists`
        })
    }
  },
  created() {
    this.getPersonDetails(this.$route.params.id)
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
}

.trailer-container {
  line-height: 0;
  padding: 0;
}

.person-name,
.tv-section-heading {
  font-size: 2em;
}

.person-bio {
  font-size: 0.875em;

  @media screen and (min-width: 600px) {
    font-size: 1em;
  }
}

.producer {
  font-size: 0.875rem;

  a {
    color: #cae9ff;

    &:hover {
      opacity: 0.7;
    }
  }
}
</style>
