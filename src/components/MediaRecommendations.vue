<template>
  <div v-if="!loading">
    <MediaCarouselCards
      :info="recommendations"
      :amount="recommendations.length"
      v-if="recommendations.length >= 1"
    />
    <div class="d-flex justify-center" v-else>
      <BaseLoadingRoller />
    </div>
  </div>
  <p v-else-if="!loading && recommendations.length === 0">
    No Recommendations.
  </p>
  <div class="d-flex justify-center" v-else>
    <BaseLoadingRoller />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import apiClient from '../services/apiCalls'
import MediaCarouselCards from '../components/MediaCarouselCards'
import BaseLoadingRoller from '../components/BaseLoadingRoller'

export default {
  name: 'MediaRecommendations',
  components: {
    MediaCarouselCards,
    BaseLoadingRoller
  },
  data() {
    return {
      loading: true,
      recommendations: [],
      allTitlesOnLists: []
    }
  },
  watch: {
    getLists: {
      deep: true,
      immediate: true,
      handler: 'getRecommendations'
    }
  },
  computed: {
    ...mapGetters(['getUID', 'getLists'])
  },
  methods: {
    getRecommendations() {
      this.recommendations = []

      const lists = []
      for (let list in this.getLists) {
        for (let title in this.getLists[list].onList) {
          lists.push(this.getLists[list].onList[title])
        }
      }

      this.allTitlesOnLists = lists

      if (this.allTitlesOnLists.length === 0) {
        this.loading = false
      }

      this.allTitlesOnLists.map((watchListTitle, index) => {
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
          if (recommendedMedia.data.results[i]) {
            let recommendedMediaTitle = recommendedMedia.data.results[i]

            const isOnList = this.allTitlesOnLists.some(title => {
              return title.id === recommendedMediaTitle.id
            })

            if (this.recommendations.length < 20 && !isOnList) {
              this.recommendations.push(recommendedMediaTitle)
            }
          }
        }
      }

      if (index === this.allTitlesOnLists.length - 1) {
        this.loading = false
      }
    }
  }
}
</script>

<style lang="scss" scoped></style>
