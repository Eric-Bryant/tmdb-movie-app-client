import Firebase from '../firebase'

export default {
  addToList(userID, media, listField) {
    const refDoc = Firebase.db.collection('lists').doc(userID)
    const listUpdate = {}
    listUpdate[`${listField}.onList.${media.id}`] = media
    refDoc.update(listUpdate)
  },
  removeFromList(userID, mediaID, listField) {
    const refDoc = Firebase.db.collection('lists').doc(userID)
    refDoc.update({
      [`${listField}.onList.${mediaID}`]: Firebase.dbDelete.delete()
    })
  }
}
