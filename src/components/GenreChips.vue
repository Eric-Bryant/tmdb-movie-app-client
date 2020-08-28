<template>
  <v-slide-group v-if="media.genres.length > 0">
    <v-slide-item v-for="(genre, index) in media.genres" :key="index">
      <v-chip
        :to="`/genre/${genre.id}`"
        color="secondary"
        class="mr-2 mb-2 genre-chips"
        >{{ genre.name }}</v-chip
      >
    </v-slide-item>
  </v-slide-group>
</template>

<script>
export default {
  name: 'GenreChips',
  props: {
    media: {
      type: Object,
      required: true
    }
  }
}
</script>

<style lang="scss" scoped>
.genre-chips {
  &:first-child {
    margin-left: 0px !important;
  }

  &:last-child {
    margin-right: 0px !important;
  }
}
</style>
