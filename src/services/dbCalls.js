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
  },
  createNewList(userID, newListName) {
    const refDoc = Firebase.db.collection('lists').doc(userID)
    const newListFieldName = camelize(newListName)

    refDoc.update({
      [newListFieldName]: {
        name: newListName,
        onList: {}
      }
    })

    function camelize(str) {
      return str
        .replace(/(?:^\w|[A-Z]|\b\w)/g, function(word, index) {
          return index === 0 ? word.toLowerCase() : word.toUpperCase()
        })
        .replace(/\s+/g, '')
    }
  },
  deleteList(userID, listField) {
    const refDoc = Firebase.db.collection('lists').doc(userID)
    refDoc.update({
      [listField]: Firebase.dbDelete.delete()
    })
  },
  renameList(userID, list, currentListField, newListField) {
    const refDoc = Firebase.db.collection('lists').doc(userID)
    const newListFieldName = camelize(newListField)

    list.name = newListField

    refDoc.update({
      [currentListField]: Firebase.dbDelete.delete()
    })

    refDoc.update({
      [newListFieldName]: list
    })

    function camelize(str) {
      return str
        .replace(/(?:^\w|[A-Z]|\b\w)/g, function(word, index) {
          return index === 0 ? word.toLowerCase() : word.toUpperCase()
        })
        .replace(/\s+/g, '')
    }
  }
}
