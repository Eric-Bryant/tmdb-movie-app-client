<template>
  <iframe
    v-if="mediaVideos"
    :width="width"
    :height="height"
    :src="`https://www.youtube.com/embed/${youtubeID}`"
    frameborder="0"
    allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
    allowfullscreen
  ></iframe>
</template>

<script>
import apiClient from '../services/apiCalls'

export default {
  name: 'MediaTrailer',
  props: {
    mediaID: {
      type: Number,
      required: true
    },
    mediaType: {
      type: String,
      required: true
    },
    width: {
      type: String,
      required: true
    },
    height: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      mediaVideos: [],
      youtubeID: '',
      vimeoID: ''
    }
  },
  created() {
    if (this.mediaType == 'Movie') {
      apiClient.getMovieTrailers(this.mediaID).then(result => {
        if (result.data) {
          this.mediaVideos = result.data
          if (this.mediaVideos.results.length > 1) {
            this.mediaVideos.results.map(video => {
              if (video.type == 'Trailer') {
                this.youtubeID = video.key
              }
            })
          } else {
            this.youtubeID = this.mediaVideos.results[0].key
          }
        }
      })
    }
  }
}
</script>

<style></style>
