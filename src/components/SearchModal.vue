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
            <v-list-item-avatar v-if="result.image">
              <img
                :src="'https://image.tmdb.org/t/p/w92/' + result.image"
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
                  result.release ? `(${result.release})` : ''
                }}</v-list-item-title
              >
              <v-list-item-subtitle>{{
                result.overview ? result.overview : ''
              }}</v-list-item-subtitle>
            </v-list-item-content>
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
    getResults(results) {
      this.results = results.items
      this.searchType = results.searchType
    },
    goToDetails(result) {
      if (result.media_type == 'Movie' || this.searchType == 'Movies') {
        this.$router.push(`/movie/${result.id}`)
      } else if (result.media_type == 'Tv' || this.searchType == 'TV') {
        this.$router.push(`/tv/${result.id}`)
      } else if (result.media_type == 'Person' || this.searchType == 'People') {
        this.$router.push(`/person/${result.id}`)
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
