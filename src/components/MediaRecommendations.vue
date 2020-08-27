<template>
  <div>
    <div v-if="loading">
      <BaseLoadingListSkeleton :amount="3" />
    </div>
    <div v-else>
      <MediaCarouselCards
        :info="recommendations"
        :mobile="false"
        class="d-none d-sm-flex"
      />
      <MediaCarouselCards
        :info="recommendations"
        :mobile="true"
        class="d-flex d-sm-none"
      />
    </div>
    <v-skeleton-loader type="card-heading" v-if="loading" />
    <p v-if="!loading && recommendations.length === 0">
      No Recommendations. Your List is Empty.
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
      recommendations: []
    }
  },
  computed: {
    ...mapGetters(['getUID'])
  },
  methods: {
    async getRecommendations() {
      const watchList = await dbClient.getUserWatchList(this.getUID)

      if (watchList.length === 0) {
        this.loading = false
      }

      watchList.map(async (watchListTitle, index) => {
        const recommendedMovies = await apiClient.getRecommendedMovies(
          watchListTitle.id
        )

        for (let i = 0; i < 3; i++) {
          let recommendedMovie = recommendedMovies.data.results[i]
          const isOnList = await dbClient.checkIfMediaOnList(
            this.getUID,
            recommendedMovie.id
          )

          if (this.recommendations.length < 20 && !isOnList) {
            this.recommendations.push(recommendedMovie)
          }
        }

        if (index === watchList.length - 1) {
          this.loading = false
        }
      })
    }
  },
  created() {
    this.getRecommendations()
  }
}
</script>

<style lang="scss" scoped></style>
