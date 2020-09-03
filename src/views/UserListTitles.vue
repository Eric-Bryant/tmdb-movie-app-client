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
  watch: {
    getLists: {
      deep: true,
      immediate: true,
      handler: 'getListTitles'
    }
  },
  computed: {
    ...mapGetters(['getUID', 'getLists']),
    listName() {
      let words = this.$route.params.name.split('-')
      const capitalizedWords = words.map(word => {
        return capitalizeFirstLetter(word)
      })

      return capitalizedWords.join(' ')

      function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1)
      }
    }
  },
  methods: {
    getListTitles() {
      let list = []
      for (let key in this.getLists) {
        if (this.listName == this.getLists[key].name) {
          list = this.getLists[key].onList
        }
      }

      this.userListTitles = Object.keys(list).map(title => {
        return list[title]
      })

      this.loading = false
      this.setTitleTag()
    },
    setTitleTag() {
      document.title = `${this.listName} | My Media Lists`
    }
  }
}
</script>

<style></style>
