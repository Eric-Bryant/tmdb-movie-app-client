<template>
  <div>
    <v-list-item v-if="loggedIn">
      <v-list-item-avatar v-if="getAvatar"
        ><img :src="getAvatar"
      /></v-list-item-avatar>
      <v-list-item-avatar v-else>
        <v-avatar color="primary" class="white--text">{{
          getFirstInitial + getLastInitial
        }}</v-avatar>
      </v-list-item-avatar>
      <v-list-item-title class="title">
        {{ getDisplayName }}
      </v-list-item-title>
    </v-list-item>
    <v-divider></v-divider>
    <v-list dense nav @click="toggleNav">
      <v-list-item :to="{ name: 'Home' }" exact>
        <v-list-item-icon>
          <v-icon>mdi-home</v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          Home
        </v-list-item-content>
      </v-list-item>
      <v-list-item :to="{ name: 'UserLists' }" exact v-if="loggedIn">
        <v-list-item-icon>
          <v-icon>mdi-clipboard-list</v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          My Lists
        </v-list-item-content>
      </v-list-item>
      <v-list-item :to="{ name: 'Login' }" exact v-if="!loggedIn">
        <v-list-item-icon>
          <v-icon>mdi-account-circle</v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          Login
        </v-list-item-content>
      </v-list-item>
      <v-list-item @click="logout" v-else>
        <v-list-item-icon>
          <v-icon>mdi-exit-to-app</v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          Logout
        </v-list-item-content>
      </v-list-item>
      <v-list-item :to="{ name: 'CreateAccount' }" exact v-if="!loggedIn">
        <v-list-item-icon>
          <v-icon>mdi-account-plus</v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          Sign Up
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </div>
</template>

<script>
import Firebase from '../firebase'
import { mapGetters } from 'vuex'
export default {
  name: 'TheSidePanel',
  data() {
    return {
      menuItems: [
        {
          title: 'Logout',
          icon: 'mdi-exit-to-app'
        }
      ]
    }
  },
  computed: {
    ...mapGetters([
      'getDisplayName',
      'getEmail',
      'getAvatar',
      'loggedIn',
      'getFirstName',
      'getLastName'
    ]),
    getFirstInitial() {
      return this.getFirstName.substr(0, 1)
    },
    getLastInitial() {
      return this.getLastName.substr(0, 1)
    }
  },
  methods: {
    logout() {
      Firebase.logout()
      this.toggleNav()
      if (this.$route.name != 'Home') {
        this.$router.push({ name: 'Home' })
      }
    },
    toggleNav() {
      this.$emit('toggleNav')
    }
  }
}
</script>

<style></style>
