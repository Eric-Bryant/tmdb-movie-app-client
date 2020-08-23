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
  addToWatchedList(userID, media) {
    const refDoc = Firebase.db.collection('lists').doc(userID)
    const watchedListUpdate = {}
    watchedListUpdate[`watched.onList.${media.id}`] = media
    refDoc
      .update({
        [`watchList.onList.${media.id}`]: Firebase.dbDelete.delete()
      })
      .then(() => {
        refDoc.update(watchedListUpdate)
      })
  },
  async getUsersLists(userID) {
    const refDoc = Firebase.db.collection('lists').doc(userID)
    const userData = await refDoc.get()
    if (userData.exists) {
      const lists = userData.data()
      const listsInfo = Object.keys(lists).map(list => {
        const listWithTitles = lists[list].onList
        let listImage
        Object.keys(listWithTitles).map(title => {
          if (listWithTitles[title].poster_path != null && !listImage) {
            listImage = listWithTitles[title].poster_path
          }
        })
        const listName = lists[list].name
        const listLength = Object.keys(listWithTitles).length
        return { name: listName, length: listLength, image: listImage }
      })

      return listsInfo
    } else {
      console.log('No user lists found')
    }
  },
  async checkIfMediaOnList(userID, mediaID) {
    const refDoc = Firebase.db.collection('lists').doc(userID)
    const userData = await refDoc.get()
    if (userData.exists) {
      const lists = userData.data()
      let isOnList = false
      const listReferences = Object.keys(lists)
      listReferences.map(list => {
        if (lists[list].name != 'Watched') {
          const listTitleIDs = Object.keys(lists[list].onList)
          listTitleIDs.map(id => {
            if (!isOnList && mediaID == id) {
              isOnList = true
            }
          })
        }
      })
      return isOnList
    } else {
      return false
    }
  },
  async getUserWatchList(userID) {
    const refDoc = Firebase.db.collection('lists').doc(userID)
    const userData = await refDoc.get()
    if (userData.exists) {
      const list = userData.data().watchList.onList
      const listMediaIDs = Object.keys(list)
      const watchList = listMediaIDs.map(id => {
        return list[id]
      })
      return watchList
    } else {
      console.log('no watch list found')
    }
  },
  async getUserWatchedList(userID) {
    const refDoc = Firebase.db.collection('lists').doc(userID)
    const userData = await refDoc.get()
    if (userData.exists) {
      const list = userData.data().watched.onList
      const listMediaIDs = Object.keys(list)
      const watchedList = listMediaIDs.map(id => {
        return list[id]
      })
      return watchedList
    } else {
      console.log('no watch list found')
    }
  }
}
