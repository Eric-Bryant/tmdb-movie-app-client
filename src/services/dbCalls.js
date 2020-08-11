import Firebase from '../firebase'

export default {
  addMediaToWatchList(userID, mediaID, mediaTitle) {
    const refDoc = Firebase.db.collection('users').doc(userID)
    const watchListUpdate = {}
    watchListUpdate[`WatchList.${mediaID}.title`] = mediaTitle
    refDoc.update(watchListUpdate)
  },
  removeMediaFromWatchList(userID, mediaID, mediaTitle) {
    const FieldValue = Firebase.db
    const refDoc = Firebase.db.collection('users').doc(userID)
    const watchListRemoval = {}
    // watchListRemoval[`WatchList.${mediaID}`] = Firebase.db.FieldValue.delete()
    // console.log(watchListRemoval)
    console.log(Firebase.db.FieldValue)
    refDoc.update({
      [`WatchList.${mediaID}`]: Firebase.dbDelete.delete()
    })
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
    const userWatchListTitles = Object.keys(userWatchList).map(mediaID => {
      return mediaID
    })

    return userWatchListTitles
  }
}
