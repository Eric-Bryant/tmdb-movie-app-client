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
      dense
      clearable
      hide-details
      item-text="title"
      item-value="title"
      placeholder="Search for something..."
      return-object
      append-outer-icon="mdi-magnify"
      append-icon
      @change="goToDetails"
      @click:append-outer="goToDetails"
      class="search-form-group__autocomplete"
    >
      <template v-slot:item="data">
        <template v-if="data.item.isSearch">
          <v-list-item-content v-text="data.item.title"></v-list-item-content>
        </template>
        <template v-else>
          <v-list-item-avatar v-if="resultImage(data)">
            <img
              :src="'https://image.tmdb.org/t/p/w92/' + resultImage(data)"
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
                  `${
                    resultRelease(data) ? ' (' + resultRelease(data) + ')' : ''
                  }`
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
      @keyup.enter="goToDetails"
      @click:append="goToDetails"
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
    },
    $route(to, from) {
      this.search = null
    }
  },
  computed: {
    resultsAndSearchType() {
      return { items: this.items, searchType: this.searchType }
    }
  },
  methods: {
    resultImage(data) {
      if (data.item.poster_path) {
        return data.item.poster_path
      } else if (data.item.profile_path) {
        return data.item.profile_path
      } else {
        return false
      }
    },
    resultRelease(data) {
      if (data.item.release_date) {
        return data.item.release_date.split('-')[0]
      } else if (data.item.first_air_date) {
        return data.item.first_air_date.split('-')[0]
      } else {
        return false
      }
    },
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
              if (!result.media_type) {
                if (result.original_name) {
                  result.media_type = 'tv'
                } else if (result.title) {
                  result.media_type = 'movie'
                } else if (result.known_for_department) {
                  result.media_type = 'person'
                } else {
                  result.media_type = 'none'
                }
              }
              result.title = result.title || result.name

              return result
            })

            this.items.push({
              title: `Search for ${this.search}...`,
              isSearch: true,
              query: this.search
            })

            this.loading = false
          })
          .catch(error => {
            console.log('There was an error:', error)
          })

        if (this.onModal) {
          this.$emit('sendResultsToModal', this.resultsAndSearchType)
        }
      } else {
        this.items = []
      }
    },
    goToDetails() {
      if (this.searchQuery.media_type == 'movie') {
        this.$router.push(`/movie/${this.searchQuery.id}`)
      } else if (this.searchQuery.media_type == 'tv') {
        this.$router.push(`/tv/${this.searchQuery.id}`)
      } else if (this.searchQuery.media_type == 'person') {
        this.$router.push(`/person/${this.searchQuery.id}`)
      } else {
        this.$router.push(`/search/${this.search}/?type=${this.searchType}`)
      }
      this.$emit('closeModal')
      this.searchQuery = ''
      this.search = ''
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

.v-autocomplete.v-select--is-menu-active .v-input__icon--append .v-icon {
  transform: none;
}
</style>
