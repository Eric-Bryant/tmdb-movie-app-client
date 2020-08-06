<template>
  <v-app-bar app color="primary" dark dense>
    <div class="d-flex align-center">
      <router-link :to="{ name: 'Home' }">
        <v-img
          alt="Sakura"
          class="shrink"
          contain
          :src="require('../assets/sakura.svg')"
          transition="scale-transition"
          width="40"
      /></router-link>
    </div>
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

<style></style>
