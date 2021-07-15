<template>
  <v-card>
    <div class="d-flex flex-no-wrap justify-space-between">
      <div>
        <v-card-title>{{ list.name }}</v-card-title>
        <v-card-subtitle
          >{{ listLength }}
          {{ listLength > 1 || listLength == 0 ? 'titles' : 'title' }}
          on this list</v-card-subtitle
        >
      </div>
      <v-spacer></v-spacer>
      <v-avatar class="ma-3" size="64" tile>
        <v-img
          :src="listImageBaseURL + listImagePath"
          v-if="listImagePath"
        ></v-img>
        <v-icon size="64" v-else>mdi-view-list</v-icon>
      </v-avatar>
    </div>
    <v-card-actions
      ><v-btn small :to="{ path: `/my-lists/${listSlug}` }" color="primary"
        >View</v-btn
      ></v-card-actions
    >
  </v-card>
</template>

<script>
export default {
  name: 'BaseListCard',
  props: {
    list: {
      type: Object,
      required: true
    }
  },
  computed: {
    listImageBaseURL() {
      return 'https://image.tmdb.org/t/p/w92/'
    },
    listSlug() {
      return this.list.name
        .replaceAll(' ', '-')
        .split('')
        .map(character => {
          return character.toLowerCase()
        })
        .join('')
    },
    listLength() {
      return Object.keys(this.list.onList).length
    },
    listImagePath() {
      const listKeys = Object.keys(this.list.onList)
      if (listKeys.length > 0) {
        return this.list.onList[listKeys[0]].poster_path
      } else {
        return null
      }
    }
  }
}
</script>
