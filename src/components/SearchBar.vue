<template>
  <div class="search-form-group">
    <v-select
      v-model="searchType"
      dense
      :items="['All', 'Movies', 'TV', 'People']"
      outlined
      @change="search = ''"
      hide-details
      class="search-form-group__search-type"
    ></v-select>
    <v-autocomplete
      v-if="!onModal"
      v-model="searchQuery"
      hide-no-data
      :items="items"
      :loading="loading"
      :search-input.sync="search"
      hide-selected
      outlined
      append-icon
      dense
      clearable
      hide-details
      item-text="title"
      item-value="title"
      placeholder="Search for something..."
      return-object
      prepend-inner-icon="mdi-magnify"
      @change="goToDetails"
      @click:prepend-inner="sendToResultsPage"
      class="search-form-group__autocomplete"
    >
      <template v-slot:item="data">
        <template v-if="typeof data.item !== 'object'">
          <v-list-item-content v-text="data.item.title"></v-list-item-content>
        </template>
        <template v-else>
          <v-list-item-avatar v-if="data.item.image">
            <img
              :src="'https://image.tmdb.org/t/p/w92/' + data.item.image"
              class="avatar"
            />
          </v-list-item-avatar>
          <v-list-item-avatar v-else class="secondary">
            <span class="white--text">??</span>
          </v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title
              v-html="
                data.item.title +
                  `${data.item.release ? ' (' + data.item.release + ')' : ''}`
              "
            ></v-list-item-title>
          </v-list-item-content>
        </template>
      </template>
    </v-autocomplete>
    <v-text-field
      v-else
      outlined
      hide-details
      dense
      append-icon="mdi-magnify"
      @keyup.enter="sendToResultsPage"
      @click:append="sendToResultsPage"
      v-model="search"
      class="search-form-group__text-field"
    >
    </v-text-field>
  </div>
</template>

<script>
import apiClient from '../services/apiCalls'
export default {
  name: 'SearchBar',
  props: {
    onModal: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      searchType: 'All',
      searchQuery: '',
      search: null,
      loading: false,
      items: []
    }
  },
  watch: {
    search() {
      this.makeSearch()
    }
  },
  computed: {
    resultsAndSearchType() {
      return { items: this.items, searchType: this.searchType }
    }
  },
  methods: {
    makeSearch() {
      if (this.search != null && this.search.replace(/\s+/g, '') != '') {
        let apiSearch

        switch (this.searchType) {
          case 'All':
            apiSearch = apiClient.searchMulti
            break
          case 'Movies':
            apiSearch = apiClient.searchMovie
            break
          case 'TV':
            apiSearch = apiClient.searchTV
            break
          case 'People':
            apiSearch = apiClient.searchPerson
            break
        }

        this.loading = true

        apiSearch(this.search)
          .then(response => {
            this.items = response.data.results.map(result => {
              const resultObject = {}
              resultObject.title = result.title || result.name
              resultObject.image = result.poster_path || result.profile_path
              if (result.media_type) {
                resultObject.media_type =
                  result.media_type.charAt(0).toUpperCase() +
                  result.media_type.slice(1)
              }
              resultObject.release =
                result.release_date || result.first_air_date || undefined
              if (resultObject.release) {
                resultObject.release = resultObject.release.split('-')[0]
              }
              if (result.overview) {
                resultObject.overview = result.overview
              }
              resultObject.id = result.id
              return resultObject
            })

            this.loading = false
          })
          .catch(error => {
            console.log('There was an error:', error.response)
          })

        if (this.onModal) {
          this.$emit('sendResultsToModal', this.resultsAndSearchType)
        }
      } else {
        this.items = []
      }
    },
    goToDetails() {
      if (
        this.searchQuery.media_type == 'Movie' ||
        this.searchType == 'Movies'
      ) {
        this.$router.push(`/movie/${this.searchQuery.id}`)
      } else if (
        this.searchQuery.media_type == 'Tv' ||
        this.searchType == 'TV'
      ) {
        this.$router.push(`/tv/${this.searchQuery.id}`)
      } else if (
        this.searchQuery.media_type == 'Person' ||
        this.searchType == 'People'
      ) {
        this.$router.push(`/person/${this.searchQuery.id}`)
      }
      this.$emit('closeModal')
      this.searchQuery = ''
      this.search = ''
    },
    sendToResultsPage() {
      this.$router.push(`/search/${this.search}`)
      this.search = ''
      this.$emit('closeModal')
    }
  }
}
</script>

<style lang="scss" scoped>
.search-form-group {
  width: 90%;
  display: flex;

  @media screen and (min-width: 600px) {
    width: 75%;
  }

  @media screen and (min-width: 1024px) {
    width: 768px;
  }

  &__search-type {
    border-top-right-radius: 0px;
    border-bottom-right-radius: 0px;
    font-size: 0.75rem;
    flex: 1 1 15%;
    @media screen and (min-width: 768px) {
      font-size: 1rem;
    }
  }

  &__autocomplete,
  &__text-field {
    flex: 1 1 85%;
    border-top-left-radius: 0px;
    border-bottom-left-radius: 0px;
    font-size: 0.75rem;
    @media screen and (min-width: 768px) {
      font-size: 1rem;
    }
  }
}

.avatar {
  object-fit: cover;
}
</style>
