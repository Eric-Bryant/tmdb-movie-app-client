import Vue from 'vue'
import Vuex from 'vuex'
import user from './modules/user'
import { vuexfireMutations } from 'vuexfire'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {},
  mutations: {
    ...vuexfireMutations
  },
  actions: {},
  getters: {},
  modules: {
    user: user
  }
})
