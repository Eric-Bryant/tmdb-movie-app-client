import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home'
import Firebase from '../firebase'
import store from '../store/index'
import dbClient from '../services/dbCalls'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/movie/:id',
    name: 'MovieDetails',
    meta: {
      requiresDbCheck: true
    },
    component: () =>
      import(/* webpackChunkName: "moviedetails" */ '../views/MovieDetails.vue')
  },
  {
    path: '/create-account',
    name: 'CreateAccount',
    component: () =>
      import(
        /* webpackChunkName: "createaccount" */ '../views/CreateAccount.vue'
      )
  },
  {
    path: '/my-lists',
    name: 'UserLists',
    meta: {
      requiresAuth: true
    },
    component: () =>
      import(/* webpackChunkName: "userlists" */ '../views/UserLists.vue')
  },
  {
    path: '/my-lists/watch-list',
    name: 'UserWatchList',
    meta: {
      requiresAuth: true,
      requiresDbCheck: true
    },
    component: () =>
      import(/* webpackChunkName: "watchlist" */ '../views/UserWatchList.vue')
  },
  {
    path: '/login',
    name: 'Login',
    component: () =>
      import(/* webpackChunkName: "createaccount" */ '../views/Login.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  routes
})

router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some(x => x.meta.requiresAuth)
  const requiresDbCheck = to.matched.some(x => x.meta.requiresDbCheck)

  if (store.getters.loggedIn && requiresDbCheck) {
    dbClient.getUsersWatchList(store.getters.getUID).then(watchList => {
      if (watchList) {
        console.log('received data from database')
        store.dispatch('setWatchList', watchList)
      }
    })
  }

  if (requiresAuth && !Firebase.auth.currentUser) {
    next('/login')
  } else {
    next()
  }
})

export default router
