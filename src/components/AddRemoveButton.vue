<template>
  <div>
    <div v-show="onList">
      <v-menu offset-y attach>
        <template v-slot:activator="{ on, attrs }">
          <v-btn color="error" v-bind="attrs" v-on="on">Remove</v-btn>
        </template>
        <v-list dense>
          <v-list-item
            v-for="(list, index) in onTheseLists"
            :key="index"
            @click="removeFromList(list.name)"
          >
            <v-list-item-title>{{ list.name }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </div>
    <div v-show="!onList">
      <v-menu offset-y attach>
        <template v-slot:activator="{ on, attrs }">
          <v-btn color="accent" v-bind="attrs" v-on="on">Add</v-btn>
        </template>
        <v-list dense>
          <v-list-item
            v-for="(list, index) in listInOrder"
            :key="index"
            @click="addToList(list.name)"
          >
            <v-list-item-title>{{ list.name }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </div>
  </div>
</template>

<script>
import dbClient from '../services/dbCalls'
import { mapGetters } from 'vuex'

export default {
  name: 'AddRemoveButton',
  props: {
    mediaInfo: {
      type: Object,
      default: function() {
        return {}
      },
      required: true
    }
  },
  data() {
    return {
      onList: false,
      lists: []
    }
  },
  watch: {
    getLists: {
      deep: true,
      immediate: true,
      handler: 'checkIfOnList'
    }
  },
  computed: {
    ...mapGetters(['getUID', 'getLists']),
    onTheseLists() {
      return this.listInOrder.filter(list => {
        return list.isOnThisList === true
      })
    },
    listInOrder() {
      return [...this.lists].sort()
    }
  },
  methods: {
    addToList(listName) {
      let fieldName
      for (let key in this.getLists) {
        if (listName === this.getLists[key].name) {
          fieldName = key
        }
      }

      dbClient.addToList(this.getUID, this.mediaInfo, fieldName)
    },
    removeFromList(listName) {
      let fieldName
      for (let key in this.getLists) {
        if (listName === this.getLists[key].name) {
          fieldName = key
        }
      }

      dbClient.removeFromList(this.getUID, this.mediaInfo.id, fieldName)
    },
    checkIfOnList() {
      this.lists = []
      for (let key in this.getLists) {
        this.lists.push(this.getLists[key])
      }

      this.onList = false

      this.lists.map(list => {
        if (list.onList[this.mediaInfo.id]) {
          this.onList = true
          list.isOnThisList = true
        }
      })
    }
  }
}
</script>

<style></style>
