<template>
  <transition name="fade-slide">
    <div class="overlay">
      <v-card>
        <v-toolbar dense color="primary" style="border-radius: 0px;">
          <v-btn icon @click="closeModal">
            <v-icon>mdi-close</v-icon>
          </v-btn>
          <SearchBar
            @closeModal="closeModal"
            :onModal="true"
            @sendResultsToModal="getResults($event)"
          />
        </v-toolbar>
        <v-list three-line dense v-if="results.length > 0" light>
          <v-list-item
            v-for="(result, index) in results"
            :key="index"
            @click="goToDetails(result)"
          >
            <div class="d-flex" v-if="result.isSearch">
              <v-list-item-avatar>
                <v-icon color="secondary">mdi-magnify</v-icon>
              </v-list-item-avatar>
              <v-list-item-content>
                <v-list-item-title>{{ result.title }}</v-list-item-title>
              </v-list-item-content>
            </div>
            <div class="d-flex" v-else>
              <v-list-item-avatar v-if="resultImage(result)">
                <img
                  :src="'https://image.tmdb.org/t/p/w92/' + resultImage(result)"
                  class="avatar"
                />
              </v-list-item-avatar>
              <v-list-item-avatar v-else class="secondary">
                <span class="white--text">??</span>
              </v-list-item-avatar>
              <v-list-item-content>
                <v-list-item-title
                  >{{ result.title }}
                  {{
                    resultRelease(result) ? `(${resultRelease(result)})` : ''
                  }}</v-list-item-title
                >
                <v-list-item-subtitle>{{
                  result.overview ? result.overview : ''
                }}</v-list-item-subtitle>
              </v-list-item-content>
            </div>
          </v-list-item>
        </v-list>
      </v-card>
    </div>
  </transition>
</template>

<script>
import SearchBar from '../components/SearchBar'
export default {
  name: 'SearchModal',
  props: {
    dialog: {
      type: Boolean,
      default: true
    }
  },
  watch: {
    $route(to, from) {
      this.results = {}
    }
  },
  components: {
    SearchBar
  },
  data() {
    return {
      results: {},
      searchType: ''
    }
  },
  methods: {
    closeModal() {
      this.results = {}
      this.$emit('closeModal')
    },
    resultImage(result) {
      if (result.poster_path) {
        return result.poster_path
      } else if (result.profile_path) {
        return result.profile_path
      } else {
        return false
      }
    },
    resultRelease(result) {
      if (result.release_date) {
        return result.release_date.split('-')[0]
      } else if (result.first_air_date) {
        return result.first_air_date.split('-')[0]
      } else {
        return false
      }
    },
    getResults(results) {
      this.results = results.items
      this.searchType = results.searchType
    },
    goToDetails(result) {
      if (result.media_type == 'movie') {
        this.$router.push(`/movie/${result.id}`)
      } else if (result.media_type == 'tv') {
        this.$router.push(`/tv/${result.id}`)
      } else if (result.media_type == 'person') {
        this.$router.push(`/person/${result.id}`)
      } else {
        this.$router.push(`/search/${result.query}/?type=${this.searchType}`)
      }
      this.$emit('closeModal')
      this.results = {}
    }
  }
}
</script>
<style lang="scss" scoped>
.overlay {
  width: 100vw;
  position: absolute;
  height: 100vh;
  left: 0;
  top: 0;
  padding: 0;
  z-index: 9999;
  overflow-y: scroll;
}
.avatar {
  object-fit: cover;
}

.fade-slide-enter-active {
  transition: transform 0.2s;
}

.fade-slide-leave-active {
  transition: transform 0.6s;
}
.fade-slide-enter,
.fade-slide-leave-to {
  transform: translateY(-100%);
}
</style>
