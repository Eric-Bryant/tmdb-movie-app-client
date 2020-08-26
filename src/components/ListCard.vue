<template>
  <v-card>
    <div class="d-flex flex-no-wrap justify-space-between">
      <div>
        <v-card-title>{{ list.name }}</v-card-title>
        <v-card-subtitle
          >{{ list.length }}
          {{ list.length > 1 || list.length == 0 ? 'titles' : 'title' }}
          on this list</v-card-subtitle
        >
      </div>
      <v-spacer></v-spacer>
      <v-avatar class="ma-3" size="64" tile>
        <v-img :src="listImageBaseURL + list.image" v-if="list.image"></v-img>
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
  name: 'ListCard',
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
        .replace(' ', '-')
        .split('')
        .map(character => {
          return character.toLowerCase()
        })
        .join('')
    }
  }
}
</script>
