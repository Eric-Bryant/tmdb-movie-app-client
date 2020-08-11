<template>
  <v-card class="mb-5 d-flex flex-column">
    <v-img
      gradient="rgba(0,0,0,0.5), rgba(0,0,0,0.6)"
      class="white--text align-end"
      height="250px"
      max-height="250px"
      :src="
        moviePoster
          ? moviePoster
          : 'https://www.urbansplash.co.uk/images/placeholder-16-9.jpg'
      "
    >
      <v-card-title style="text-shadow: 0px 2px 2px #000">{{
        movieTitle
      }}</v-card-title>
    </v-img>
    <v-card-text class="text--primary">
      <div>{{ truncatedDescription }}</div>
    </v-card-text>
    <v-spacer></v-spacer>
    <v-card-actions>
      <v-btn color="info" :to="movieLink">Read</v-btn>
      <v-btn color="primary" v-if="!onList" @click="addToWatchList">Add</v-btn>
      <v-btn color="warning">Remove</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import dbClient from '../services/dbCalls'
import { mapGetters } from 'vuex'

export default {
  name: 'MovieCard',
  props: {
    movieInfo: {
      type: Object,
      default: function() {
        return {}
      }
    }
  },
  data() {
    return {
      movieTitle: this.movieInfo.title,
      moviePoster:
        'https://image.tmdb.org/t/p/w342/' + this.movieInfo.poster_path,
      movieDescription: this.movieInfo.overview,
      movieLink: '/movie/' + this.movieInfo.id,
      onList: false
    }
  },
  computed: {
    ...mapGetters(['getUID', 'loggedIn']),
    truncatedDescription() {
      return (this.movieDescription.substr(0, 160) + '...').trim()
    }
  },
  methods: {
    async getWatchList() {
      const watchList = await dbClient.getUsersWatchList(this.getUID)
      if (watchList) {
        console.log(Object.keys(watchList))
      } else {
        console.log('no watchlist')
      }
    }
  }
}
</script>

<style></style>
