export default {
  state: {
    user: {
      loggedIn: false,
      data: {
        displayName: '',
        email: '',
        avatar: '',
        uid: ''
      }
    }
  },
  mutations: {
    SET_USER: (state, user) => {
      if (user) {
        if (user.displayName != null) {
          state.user.data.displayName = user.displayName
        } else {
          state.user.data.displayName = 'New User'
        }
        state.user.data.email = user.email
        state.user.data.avatar = user.photoURL
        state.user.loggedIn = true
        state.user.data.uid = user.uid
      } else {
        state.user.data = {
          displayName: '',
          email: '',
          avatar: '',
          uid: ''
        }
        state.user.loggedIn = false
      }
    }
  },
  actions: {
    setUser: (context, user) => {
      context.commit('SET_USER', user)
    }
  },
  getters: {
    getDisplayName: state => {
      return state.user.data.displayName
    },
    getEmail: state => {
      return state.user.data.email
    },
    getFirstName: state => {
      return state.user.data.displayName.split(' ')[0]
    },
    getLastName: state => {
      return state.user.data.displayName.split(' ')[1]
    },
    getAvatar: state => {
      return state.user.data.avatar
    },
    getUID: state => {
      return state.user.data.uid
    },
    loggedIn: state => {
      return state.user.loggedIn
    }
  }
}
