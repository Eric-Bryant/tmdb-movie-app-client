<template>
  <p v-if="mediaType == 'Movie'" class="director">
    Director:
    <router-link :to="`/person/${movieDirector.id}`">{{
      movieDirector.name
    }}</router-link>
  </p>
</template>

<script>
import apiClient from '../services/apiCalls'
export default {
  name: 'MediaCredits',
  props: {
    mediaID: {
      type: Number,
      required: true
    },
    mediaType: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      mediaCredits: [],
      movieDirector: ''
    }
  },
  created() {
    if (this.mediaType == 'Movie') {
      apiClient.getMovieCredits(this.mediaID).then(result => {
        if (result.data) {
          this.mediaCredits = result.data

          this.mediaCredits.crew.map(crewMember => {
            if (crewMember.job == 'Director') {
              this.movieDirector = crewMember
            }
          })
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.director {
  font-size: 0.875rem;
}
</style>
