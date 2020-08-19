export default {
  state: {
    user: {
      loggedIn: false,
      data: {
        displayName: '',
        email: '',
        avatar: '',
        uid: '',
        lists: {
          watchList: [],
          watched: []
        }
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
          uid: '',
          lists: {
            watchList: [],
            watched: []
          }
        }
        state.user.loggedIn = false
      }
    },
    SET_WATCH_LIST: (state, watchList) => {
      state.user.data.lists.watchList = watchList
    },
    ADD_TO_WATCH_LIST: (state, { newMedia, onList }) => {
      if (!onList) {
        state.user.data.lists.watchList.push(newMedia)
        console.log('media added to watch list')
      } else {
        console.log('media already on watch list')
      }
    },
    REMOVE_FROM_WATCH_LIST: (state, { updatedWatchList, onList }) => {
      if (onList) {
        state.user.data.lists.watchList = updatedWatchList
        console.log('media removed from watch list')
      } else {
        console.log("media wasn't on watch list")
      }
    },
    SET_WATCHED_LIST: (state, watchedList) => {
      state.user.data.lists.watched = watchedList
    },
    ADD_TO_WATCHED_LIST: (state, { newMedia, onList }) => {
      if (!onList) {
        state.user.data.lists.watched.push(newMedia)
        console.log('media added to watched list')
      } else {
        console.log('media already on watched list')
      }
    }
  },
  actions: {
    setUser: (context, user) => {
      context.commit('SET_USER', user)
    },
    setWatchList: (context, watchList) => {
      context.commit('SET_WATCH_LIST', watchList)
    },
    setWatchedList: (context, watchedList) => {
      context.commit('SET_WATCHED_LIST', watchedList)
    },
    addMediaToWatchList: (context, media) => {
      const onList = context.getters.getWatchList.some(mediaItem => {
        const watchListMediaId = Object.keys(mediaItem).join()
        return media.id == watchListMediaId
      })
      const newMedia = {}
      newMedia[`${media.id}`] = media

      context.commit('ADD_TO_WATCH_LIST', { newMedia, onList })
    },
    removeMediaFromWatchList: (context, media) => {
      let onList = false
      const updatedWatchList = context.getters.getWatchList.filter(
        mediaItem => {
          const watchListMediaId = Object.keys(mediaItem).join()
          if (media.id == watchListMediaId) {
            onList = true
          }
          return media.id != watchListMediaId
        }
      )
      context.commit('REMOVE_FROM_WATCH_LIST', { updatedWatchList, onList })
    },
    addToWatchedList: (context, media) => {
      const onList = context.getters.getWatchedList.some(mediaItem => {
        const watchedListMediaId = Object.keys(mediaItem).join()
        return media.id == watchedListMediaId
      })
      const newMedia = {}
      newMedia[`${media.id}`] = media

      context.commit('ADD_TO_WATCHED_LIST', { newMedia, onList })
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
    },
    getWatchList: state => {
      return state.user.data.lists.watchList
    },
    getWatchedList: state => {
      return state.user.data.lists.watched
    }
  }
}
