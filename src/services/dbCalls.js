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
  }
}
