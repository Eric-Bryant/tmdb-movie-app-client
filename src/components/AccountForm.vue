<template>
  <v-card class="mx-auto account-form-card">
    <v-card-title v-if="formType == 'Login'">{{
      loggedIn ? 'You already are logged in' : 'Log In'
    }}</v-card-title>
    <v-card-title v-else>{{
      loggedIn ? 'You already are logged in' : 'Create an Account'
    }}</v-card-title>
    <v-card-text>
      <v-form ref="form" v-model="valid" v-if="!loggedIn">
        <v-text-field
          v-if="formType == 'Register'"
          v-model="firstName"
          label="First Name"
          required
          outlined
          hide-details
          class="mb-2"
        ></v-text-field>
        <v-text-field
          v-if="formType == 'Register'"
          v-model="lastName"
          label="Last Name"
          required
          outlined
          hide-details
          class="mb-2"
        ></v-text-field>
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
          v-if="formType == 'Login'"
          block
          color="primary"
          @click="login"
          :disabled="!valid"
          :loading="loggingIn"
          >Log In</v-btn
        >
        <v-btn
          v-else
          block
          color="primary"
          @click="signUp"
          :disabled="!valid"
          :loading="loggingIn"
          >Sign Up</v-btn
        >
        <v-btn block class="mt-2" color="warning" @click="reset">Reset</v-btn>
        <v-btn
          v-if="formType == 'Login'"
          class="mt-2"
          block
          color="primary"
          @click="loginGoogle"
          :loading="loggingIn"
          ><v-icon left>mdi-google</v-icon>Login w/ Google</v-btn
        >
        <v-btn
          v-else
          class="mt-2"
          block
          color="primary"
          @click="signUpGoogle"
          :loading="loggingIn"
          ><v-icon left>mdi-google</v-icon>Create Account w/ Google</v-btn
        >
      </v-form>
    </v-card-text>
  </v-card>
</template>

<script>
import Firebase from '../firebase'
import dbClient from '../services/dbCalls'
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'AccountForm',
  props: {
    formType: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      valid: false,
      firstName: '',
      lastName: '',
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
    ...mapActions(['setUser']),
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
          var errorCode = error.code
          var errorMessage = error.message
          console.log(errorCode, errorMessage)
        })
    },
    signUp() {
      this.loggingIn = true
      Firebase.auth
        .createUserWithEmailAndPassword(this.email, this.password)
        .then(result => {
          this.loggingIn = false

          result.user
            .updateProfile({
              displayName: `${this.firstName} ${this.lastName}`
            })
            .then(() => {
              console.log('display name updated')
              this.setUser(result.user)
            })
            .catch(error => {
              console.log(error)
            })

          Firebase.db
            .collection('lists')
            .doc(result.user.uid)
            .set({
              watchList: {
                name: 'Watch List',
                onList: {}
              },
              watched: {
                name: 'Watched',
                onList: {}
              }
            })

          this.$router.push({ name: 'Home' })
        })
        .catch(error => {
          this.loggingIn = false
          // Handle Errors here.
          var errorCode = error.code
          var errorMessage = error.message
          // ...
        })
    },
    signUpGoogle() {
      this.loggingIn = true
      const provider = Firebase.googleProvider
      Firebase.auth
        .signInWithPopup(provider)
        .then(result => {
          this.loggingIn = false

          this.setUser(result.user)

          Firebase.db
            .collection('lists')
            .doc(result.user.uid)
            .get()
            .then(doc => {
              if (!doc.exists) {
                Firebase.db
                  .collection('lists')
                  .doc(result.user.uid)
                  .set({
                    watchList: {
                      name: 'Watch List',
                      onList: {}
                    },
                    watched: {
                      name: 'Watched',
                      onList: {}
                    }
                  })
              } else {
                console.log('user already exists in database')
              }
            })
        })
        .catch(error => {
          this.loggingIn = false
          const errorCode = error.code
          const errorMessage = error.message
          const email = error.email
          const credential = error.credential
          console.log(errorCode, errorMessage, email, credential)
        })
        .finally(() => {
          this.$router.push({ name: 'Home' })
        })
    },
    reset() {
      this.$refs.form.reset()
    }
  }
}
</script>

<style lang="scss" scoped>
.account-form-card {
  max-width: 320px;
  width: 100%;
}
</style>
