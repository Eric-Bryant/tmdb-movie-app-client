<template>
  <div v-if="!loading && userListTitles.length > 0">
    <v-container>
      <h1>{{ listName }}</h1>
      <v-row no-gutters class="d-none d-sm-flex">
        <v-col
          cols="6"
          sm="2"
          v-for="(title, index) in userListTitles"
          :key="index"
        >
          <MediaCard width="185px" height="250px" :media="title" />
        </v-col>
      </v-row>
      <MediaCarouselCards :info="userListTitles" class="d-flex d-sm-none" />
    </v-container>
  </div>
  <v-container
    v-else-if="!loading & (userListTitles.length == 0)"
    fill-height
    class="justify-center"
  >
    <div class="align-center">
      <h1 class="text-uppercase">Your List is Empty</h1>
    </div>
  </v-container>
  <v-container v-else fill-height class="justify-center">
    <div class="d-flex align-center flex-column">
      <h1 class="mb-2 text-uppercase text-center">Loading details...</h1>
      <BaseLoadingRoller />
    </div>
  </v-container>
</template>

<script>
import { mapGetters } from 'vuex'
import BaseLoadingRoller from '../components/BaseLoadingRoller'
import MediaCard from '../components/MediaCard'
import MediaCarouselCards from '../components/MediaCarouselCards'
import dbClient from '../services/dbCalls'

export default {
  name: 'UserListTitles',
  components: {
    BaseLoadingRoller,
    MediaCard,
    MediaCarouselCards
  },
  data() {
    return {
      userListTitles: [],
      loading: true
    }
  },
  computed: {
    ...mapGetters(['getUID']),
    listName() {
      let words = this.$route.params.name.replace('-', ' ').split(' ')
      const capitalizedWords = words.map(word => {
        return capitalizeFirstLetter(word)
      })

      if (capitalizedWords.indexOf('List') < 0) {
        capitalizedWords.push('List')
      }

      return capitalizedWords.join(' ')

      function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1)
      }
    }
  },
  async created() {
    if (this.$route.params.name === 'watched') {
      dbClient.getUserWatchedList(this.getUID).then(watchedList => {
        this.userListTitles = watchedList
        this.loading = false
      })
    } else {
      dbClient.getUserWatchList(this.getUID).then(watchList => {
        this.userListTitles = watchList
        this.loading = false
      })
    }
  }
}
</script>

<style></style>
