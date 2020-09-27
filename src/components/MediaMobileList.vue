<template>
  <v-list three-line>
    <template v-for="(title, index) in info">
      <router-link :to="url(title)" exact :key="title.id">
        <v-list-item :key="title.id" v-ripple="{ center: true }">
          <v-list-item-avatar tile size="92">
            <v-img :src="image(title)"></v-img>
          </v-list-item-avatar>

          <v-list-item-content>
            <v-list-item-title
              >{{ titleName(title) }} ({{
                releaseYear(title)
              }})</v-list-item-title
            >
            <v-list-item-subtitle v-if="title.runtime">
              {{ title.runtime }}m
            </v-list-item-subtitle>
            <v-list-item-subtitle>
              {{ title.overview }}
              }}</v-list-item-subtitle
            >
          </v-list-item-content>
        </v-list-item>
      </router-link>
      <v-divider :key="index" v-if="index != info.length - 1"></v-divider>
    </template>
  </v-list>
</template>

<script>
export default {
  name: 'MediaMobileList',
  props: {
    info: {
      type: Array,
      required: true
    }
  },
  methods: {
    url(info) {
      if (info.title) {
        return `/movie/${info.id}`
      } else if (info.original_name) {
        return `/tv/${info.id}`
      } else {
        return `/person/${info.id}`
      }
    },
    image(info) {
      if (info.poster_path) {
        return `https://image.tmdb.org/t/p/w185/${info.poster_path}`
      } else if (info.profile_path) {
        return `https://image.tmdb.org/t/p/w185/${info.profile_path}`
      } else {
        return 'data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22250%22%20height%3D%22185%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20250%20185%22%20preserveAspectRatio%3D%22none%22%3E%0A%20%20%20%20%20%20%3Cdefs%3E%0A%20%20%20%20%20%20%20%20%3Cstyle%20type%3D%22text%2Fcss%22%3E%0A%20%20%20%20%20%20%20%20%20%20%23holder%20text%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20fill%3A%20transparent%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20font-family%3A%20sans-serif%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20font-size%3A%2040px%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20font-weight%3A%20400%3B%0A%20%20%20%20%20%20%20%20%20%20%7D%0A%20%20%20%20%20%20%20%20%3C%2Fstyle%3E%0A%20%20%20%20%20%20%3C%2Fdefs%3E%0A%20%20%20%20%20%20%3Cg%20id%3D%22holder%22%3E%0A%20%20%20%20%20%20%20%20%3Crect%20width%3D%22100%25%22%20height%3D%22100%25%22%20fill%3D%22%23E0E0E0%22%3E%3C%2Frect%3E%0A%20%20%20%20%20%20%20%20%3Cg%3E%0A%20%20%20%20%20%20%20%20%20%20%3Ctext%20text-anchor%3D%22middle%22%20x%3D%2250%25%22%20y%3D%2250%25%22%20dy%3D%22.3em%22%3E250%20x%20185%3C%2Ftext%3E%0A%20%20%20%20%20%20%20%20%3C%2Fg%3E%0A%20%20%20%20%20%20%3C%2Fg%3E%0A%20%20%20%20%3C%2Fsvg%3E'
      }
    },
    titleName(info) {
      if (info.title) {
        return info.title
      } else if (info.original_name) {
        return info.original_name
      } else {
        return info.name
      }
    },
    releaseYear(info) {
      if (info.release_date) {
        return info.release_date.split('-')[0]
      } else if (info.first_air_date) {
        return info.first_air_date.split('-')[0]
      } else {
        return false
      }
    }
  }
}
</script>

<style lang="scss" scoped>
a {
  text-decoration: none;
}
</style>
