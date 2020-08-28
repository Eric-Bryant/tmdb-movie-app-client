<template>
  <div>
    <div v-if="loading">
      <BaseLoadingListSkeleton :amount="3" />
    </div>
    <div v-else>
      <MediaCarouselCards :info="recommendations" />
    </div>
    <v-skeleton-loader type="card-heading" v-if="loading" />
    <p v-if="!loading && recommendations.length === 0">
      No Recommendations.
    </p>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import apiClient from '../services/apiCalls'
import dbClient from '../services/dbCalls'
import MediaCarouselCards from '../components/MediaCarouselCards'
import BaseLoadingListSkeleton from '../components/BaseLoadingListSkeleton'

export default {
  name: 'MediaRecommendations',
  components: {
    MediaCarouselCards,
    BaseLoadingListSkeleton
  },
  data() {
    return {
      loading: true,
      recommendations: [],
      allTitlesOnLists: []
    }
  },
  computed: {
    ...mapGetters(['getUID'])
  },
  methods: {
    async getRecommendations() {
      const watchList = await dbClient.getUserWatchList(this.getUID)
      const watchedList = await dbClient.getUserWatchedList(this.getUID)

      this.allTitlesOnLists.push(...watchList)
      this.allTitlesOnLists.push(...watchedList)

      if (this.allTitlesOnLists.length === 0) {
        this.loading = false
      }

      this.allTitlesOnLists.map(async (watchListTitle, index) => {
        let type

        if (watchListTitle.name || watchListTitle.original_name) {
          type = 'TV'
        } else {
          type = 'Movie'
        }

        this.getRecommended(watchListTitle, type, index)
      })
    },
    async getRecommended(watchListTitle, type, index) {
      let recommendedMedia
      if (type === 'TV') {
        recommendedMedia = await apiClient.getRecommendedTv(watchListTitle.id)
      } else {
        recommendedMedia = await apiClient.getRecommendedMovies(
          watchListTitle.id
        )
      }

      if (recommendedMedia.data.results.length > 0) {
        for (let i = 0; i < 3; i++) {
          let recommendedMediaTitle = recommendedMedia.data.results[i]
          const isOnList = await dbClient.checkIfMediaOnList(
            this.getUID,
            recommendedMediaTitle.id
          )

          if (this.recommendations.length < 20 && !isOnList) {
            this.recommendations.push(recommendedMediaTitle)
          }
        }
      }

      if (index === this.allTitlesOnLists.length - 1) {
        this.loading = false
      }
    }
  },

  created() {
    this.getRecommendations()
  }
}
</script>

<style lang="scss" scoped></style>
