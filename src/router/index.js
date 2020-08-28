import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home'
import Firebase from '../firebase'

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
    component: () =>
      import(/* webpackChunkName: "moviedetails" */ '../views/MovieDetails.vue')
  },
  {
    path: '/tv/:id',
    name: 'TvDetails',
    component: () =>
      import(/* webpackChunkName: "tvdetails" */ '../views/TvDetails.vue')
  },
  {
    path: '/person/:id',
    name: 'PersonDetails',
    component: () =>
      import(/* webpackChunkName: "tvdetails" */ '../views/PersonDetails.vue')
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
    path: '/my-lists/:name',
    name: 'UserListTitles',
    meta: {
      requiresAuth: true
    },
    component: () =>
      import(/* webpackChunkName: "watchlist" */ '../views/UserListTitles.vue')
  },
  {
    path: '/login',
    name: 'Login',
    component: () =>
      import(/* webpackChunkName: "login" */ '../views/Login.vue')
  }
]

const router = new VueRouter({
  scrollBehavior() {
    return { x: 0, y: 0 }
  },
  mode: 'history',
  routes
})

router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some(x => x.meta.requiresAuth)
  if (requiresAuth && !Firebase.auth.currentUser) {
    next('/login')
  } else {
    next()
  }
})

export default router
