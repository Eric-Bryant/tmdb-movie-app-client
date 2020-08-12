import Firebase from '../firebase'

export default {
  addMediaToWatchList(userID, media) {
    const refDoc = Firebase.db.collection('users').doc(userID)
    const watchListUpdate = {}
    watchListUpdate[`WatchList.${media.id}`] = media
    refDoc.update(watchListUpdate)
  },
  removeMediaFromWatchList(userID, mediaID) {
    const refDoc = Firebase.db.collection('users').doc(userID)
    refDoc.update({
      [`WatchList.${mediaID}`]: Firebase.dbDelete.delete()
    })
  },
  async getUsersLists(userID) {
    const refDoc = Firebase.db.collection('users').doc(userID)
    const userData = await refDoc.get()
    if (userData.exists) {
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
    } else {
      console.log('No user lists found')
    }
  },
  async getUsersWatchList(userID) {
    const refDoc = Firebase.db.collection('users').doc(userID)
    const userData = await refDoc.get()
    if (userData.exists) {
      const userWatchList = userData.data().WatchList
      const userWatchListIds = Object.keys(userWatchList).map(mediaID => {
        return mediaID
      })
      const watchListArray = userWatchListIds.map(id => {
        const mediaObject = {}
        mediaObject[id] = userWatchList[id]
        return mediaObject
      })
      return watchListArray
    } else {
      console.log('user watch list not found')
    }
  }
}
