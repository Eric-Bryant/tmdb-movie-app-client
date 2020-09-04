import * as firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'

var firebaseConfig = {
  apiKey: process.env.FIREBASE_KEY,
  authDomain: 'tmdb-movie-application.firebaseapp.com',
  databaseURL: 'https://tmdb-movie-application.firebaseio.com',
  projectId: 'tmdb-movie-application',
  storageBucket: 'tmdb-movie-application.appspot.com',
  messagingSenderId: '479962106134',
  appId: '1:479962106134:web:cdfe0a31ce138e6aaf2837'
}
// Initialize Firebase
firebase.initializeApp(firebaseConfig)

export default {
  auth: firebase.auth(),
  googleProvider: new firebase.auth.GoogleAuthProvider(),
  db: firebase.firestore(),
  dbDelete: firebase.firestore.FieldValue,
  logout() {
    firebase
      .auth()
      .signOut()
      .then(function() {})
      .catch(function(error) {
        console.log(error)
      })
  }
}
