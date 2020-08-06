import Firebase from '../firebase'

export default {
  addMovieToWatchList(userID, movieID, movieTitle) {
    const refDoc = Firebase.db.collection('users').doc(userID)
    const watchListUpdate = {}
    watchListUpdate[`WatchList.${movieID}.title`] = movieTitle
    refDoc.update(watchListUpdate)
  },
  async getUsersWatchList(userID) {
    const refDoc = Firebase.db.collection('users').doc(userID)
    const userData = await refDoc.get()
    if (userData.data().WatchList) {
      return userData.data().WatchList
    }
  },
  async getUsersLists(userID) {
    const refDoc = Firebase.db.collection('users').doc(userID)
    const userData = await refDoc.get()
    const lists = Object.keys(userData.data()).filter(field => {
      return field.includes('List')
    })
    const parsedList = lists.map(field => {
      const titlesInList = Object.keys(userData.data()[field]).length
      const firstWord = field.slice(0, field.indexOf('L'))
      const secondWord = field.slice(field.indexOf('L'), field.length)
      return `${firstWord} ${secondWord}: ${titlesInList}`
    })

    return parsedList
  },
  async getUsersWatchList(userID) {
    const refDoc = Firebase.db.collection('users').doc(userID)
    const userData = await refDoc.get()
    const userWatchList = userData.data().WatchList
    const userWatchListTitles = Object.keys(userWatchList).map(movieID => {
      return userWatchList[movieID].title
    })

    return userWatchListTitles
  }
}
