<template>
  <v-app-bar app color="primary" dark dense class="app-bar">
    <router-link :to="{ name: 'Home' }">
      <v-img
        alt="Sakura"
        class="shrink"
        contain
        :src="require('../assets/sakura.svg')"
        transition="scale-transition"
        width="40"
    /></router-link>

    <v-spacer></v-spacer>

    <SearchBar class="d-none d-sm-flex" />
    <SearchModal
      @closeModal="modalOpen = !modalOpen"
      :dialog="modalOpen"
      v-show="modalOpen"
    />
    <v-spacer></v-spacer>
    <v-icon class="d-sm-none mr-2" @click="modalOpen = !modalOpen"
      >mdi-magnify</v-icon
    >
    <v-app-bar-nav-icon @click="toggleNav"></v-app-bar-nav-icon>
  </v-app-bar>
</template>

<script>
import SearchBar from '../components/SearchBar'
import SearchModal from '../components/SearchModal'
export default {
  name: 'TheHeader',
  components: {
    SearchBar,
    SearchModal
  },
  data() {
    return {
      modalOpen: false
    }
  },
  methods: {
    toggleNav() {
      this.$emit('toggleNav')
    }
  }
}
</script>

<style lang="scss">
.app-bar > .v-toolbar__content {
  max-width: 1140px;
  margin: 0 auto;
}
</style>
