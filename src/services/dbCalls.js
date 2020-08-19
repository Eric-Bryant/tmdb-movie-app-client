import Firebase from '../firebase'

export default {
  addMediaToWatchList(userID, media) {
    const refDoc = Firebase.db.collection('lists').doc(userID)
    const watchListUpdate = {}
    watchListUpdate[`watchList.onList.${media.id}`] = media
    refDoc.update(watchListUpdate)
  },
  removeMediaFromWatchList(userID, mediaID) {
    const refDoc = Firebase.db.collection('lists').doc(userID)
    refDoc.update({
      [`watchList.onList.${mediaID}`]: Firebase.dbDelete.delete()
    })
  },
  async getUsersLists(userID) {
    const refDoc = Firebase.db.collection('lists').doc(userID)
    const userData = await refDoc.get()
    if (userData.exists) {
      const lists = userData.data()
      const listsInfo = Object.keys(lists).map(list => {
        const listWithTitles = lists[list].onList
        const listName = lists[list].name
        const listLength = Object.keys(listWithTitles).length
        return { name: listName, length: listLength }
      })

      return listsInfo
    } else {
      console.log('No user lists found')
    }
  },
  async getUsersWatchList(userID) {
    const refDoc = Firebase.db.collection('lists').doc(userID)
    const userData = await refDoc.get()
    if (userData.exists && userData.data().WatchList) {
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
