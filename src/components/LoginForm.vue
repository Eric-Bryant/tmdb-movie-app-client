<template>
  <v-card max-width="320px" class="mx-auto mt-5">
    <v-card-title>{{
      loggedIn ? 'You already are logged in' : 'Log In'
    }}</v-card-title>
    <v-card-text>
      <v-form ref="form" v-model="valid" v-if="!loggedIn">
        <v-text-field
          v-model="email"
          :rules="emailRules"
          label="Email"
          required
          outlined
        ></v-text-field>
        <v-text-field
          :append-icon="showPass ? 'mdi-eye' : 'mdi-eye-off'"
          @click:append="showPass = !showPass"
          :type="showPass ? 'text' : 'password'"
          outlined
          :rules="passwordRules"
          hint="At least 8 characters"
          v-model="password"
          label="Password"
          required
        ></v-text-field>
        <v-btn
          block
          color="primary"
          @click="login"
          :disabled="!valid"
          :loading="loggingIn"
          >Log In</v-btn
        >
        <v-btn block class="mt-2" color="warning" @click="reset">Reset</v-btn>
        <v-btn
          class="mt-2"
          block
          color="primary"
          @click="loginGoogle"
          :loading="loggingIn"
          ><v-icon left>mdi-google</v-icon>Login w/ Google</v-btn
        >
      </v-form>
    </v-card-text>
  </v-card>
</template>

<script>
import Firebase from '../firebase'
import dbClient from '../services/dbCalls'
import { mapGetters } from 'vuex'

export default {
  name: 'LoginForm',
  data() {
    return {
      valid: false,
      email: '',
      password: '',
      showPass: false,
      emailRules: [
        v => !!v || 'E-mail is required',
        v => /.+@.+\..+/.test(v) || 'E-mail must be valid'
      ],
      passwordRules: [
        v => !!v || 'Password is required',
        v => (v && v.length >= 8) || 'Password must be at least 8 characters'
      ],
      loggingIn: false
    }
  },
  computed: {
    ...mapGetters(['loggedIn'])
  },
  methods: {
    loginGoogle() {
      this.loggingIn = true
      const provider = Firebase.googleProvider
      Firebase.auth
        .signInWithPopup(provider)
        .then(function(result) {})
        .catch(function(error) {
          this.loggingIn = false
          const errorCode = error.code
          const errorMessage = error.message
          const email = error.email
          const credential = error.credential
          console.log(errorCode, errorMessage, email, credential)
        })
        .finally(() => {
          this.loggingIn = false
          this.$router.push({ name: 'Home' })
        })
    },
    login() {
      this.loggingIn = true
      Firebase.auth
        .signInWithEmailAndPassword(this.email, this.password)
        .then(result => {
          this.loggingIn = false
          this.$router.push({ name: 'Home' })
        })
        .catch(error => {
          this.loggingIn = false
          // Handle Errors here.
          var errorCode = error.code
          var errorMessage = error.message
          console.log(errorCode, errorMessage)
          // ...
        })
    },
    reset() {
      this.$refs.form.reset()
    }
  }
}
</script>

<style></style>
