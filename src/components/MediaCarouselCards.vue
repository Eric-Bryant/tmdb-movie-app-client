<template>
  <div>
    <v-slide-group class="d-none d-sm-flex" show-arrows>
      <v-slide-item v-for="(item, index) in info" :key="index">
        <MediaCard
          width="185px"
          height="250px"
          :media="item"
          :amount="info.length"
        />
      </v-slide-item>
    </v-slide-group>
    <v-slide-group class="d-flex d-sm-none">
      <v-slide-item v-for="(item, index) in info" :key="index">
        <MediaCard
          width="100px"
          height="115"
          :media="item"
          :amount="info.length"
        />
      </v-slide-item>
    </v-slide-group>
  </div>
</template>

<script>
import MediaCard from '../components/MediaCard'
export default {
  name: 'MediaCarouselCards',
  components: {
    MediaCard
  },
  props: {
    info: {
      type: Array,
      required: true
    }
  }
}
</script>
