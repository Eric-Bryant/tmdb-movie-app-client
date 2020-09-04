import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home'
import Firebase from '../firebase'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: {
      title: 'My Media Lists'
    }
  },
  {
    path: '/movie/:id/',
    name: 'MovieDetails',
    component: () =>
      import(/* webpackChunkName: "moviedetails" */ '../views/MovieDetails.vue')
  },
  {
    path: '/tv/:id/',
    name: 'TvDetails',
    component: () =>
      import(/* webpackChunkName: "tvdetails" */ '../views/TvDetails.vue')
  },
  {
    path: '/person/:id/',
    name: 'PersonDetails',
    component: () =>
      import(
        /* webpackChunkName: "persondetails" */ '../views/PersonDetails.vue'
      )
  },
  {
    path: '/search/:searchQuery/',
    name: 'SearchResults',
    component: () =>
      import(
        /* webpackChunkName: "searchresults" */ '../views/SearchResults.vue'
      )
  },
  {
    path: '/my-lists/',
    name: 'UserLists',
    meta: {
      title: 'My Lists | My Media Lists',
      requiresAuth: true
    },
    component: () =>
      import(/* webpackChunkName: "userlists" */ '../views/UserLists.vue')
  },
  {
    path: '/my-lists/:name/',
    name: 'UserListTitles',
    meta: {
      requiresAuth: true
    },
    component: () =>
      import(/* webpackChunkName: "userlist" */ '../views/UserListTitles.vue')
  },
  {
    path: '/create-account/',
    name: 'CreateAccount',
    meta: {
      title: 'Create an Account | My Media Lists'
    },
    component: () =>
      import(
        /* webpackChunkName: "createaccount" */ '../views/CreateAccount.vue'
      )
  },
  {
    path: '/login/',
    name: 'Login',
    meta: {
      title: 'Login | My Media Lists'
    },
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
  const nearestWithTitle = to.matched
    .slice()
    .reverse()
    .find(r => r.meta && r.meta.title)

  if (nearestWithTitle) document.title = nearestWithTitle.meta.title

  const requiresAuth = to.matched.some(x => x.meta.requiresAuth)
  if (requiresAuth && !Firebase.auth.currentUser) {
    next('/login')
  } else {
    next()
  }
})

export default router
