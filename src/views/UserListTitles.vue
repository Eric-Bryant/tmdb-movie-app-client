<template>
  <div v-if="!loading && userListTitles.length > 0">
    <v-container>
      <div class="d-flex align-center">
        <h1 class="mr-2">{{ listName }}</h1>
        <v-dialog v-model="editDialog" max-width="290">
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              small
              color="primary"
              v-bind="attrs"
              v-on="on"
              class="mr-2"
              title="Edit Name"
            >
              <v-icon>mdi-pencil</v-icon>
            </v-btn>
          </template>
          <v-card>
            <v-card-title class="text-h5 text-break">
              Edit {{ listName }} List Title
            </v-card-title>
            <v-form
              ref="form"
              v-model="valid"
              class="px-6 pb-4"
              @submit.prevent
            >
              <v-text-field
                v-model="newListName"
                label="New List Title"
                required
                hide-details="auto"
                outlined
                @keyup.enter="renameList"
                :rules="rules"
              ></v-text-field>
              <p class="error--text text-caption" v-if="duplicate">
                You already have a list with that name.
              </p>
              <v-btn
                block
                color="success"
                @click="renameList"
                class="mt-2"
                :disabled="!valid"
              >
                Confirm
              </v-btn>
              <v-btn
                block
                color="primary"
                @click="editDialog = false"
                class="mt-2"
              >
                Cancel
              </v-btn>
            </v-form>
          </v-card>
        </v-dialog>
        <v-dialog v-model="deleteDialog" max-width="290">
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              small
              color="error"
              v-bind="attrs"
              v-on="on"
              title="Delete List"
            >
              <v-icon>mdi-delete</v-icon>
            </v-btn>
          </template>
          <v-card>
            <v-card-title class="text-h5 text-break">
              Delete {{ listName }}
            </v-card-title>
            <v-card-text
              >Performing this action will be permanent and you will not be able
              to restore your list. To permanently delete this list, select
              'DELETE'.</v-card-text
            >
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="primary" @click="deleteDialog = false">
                Cancel
              </v-btn>
              <v-btn color="error" @click="deleteList">
                Delete
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </div>
      <v-row no-gutters class="d-none d-sm-flex">
        <v-col
          cols="6"
          sm="2"
          v-for="(title, index) in userListTitles"
          :key="index"
        >
          <MediaCard width="185px" height="250px" :media="title" />
        </v-col>
      </v-row>
      <MediaMobileList :info="userListTitles" class="d-sm-none" />
    </v-container>
  </div>
  <v-container
    v-else-if="!loading & (userListTitles.length == 0)"
    fill-height
    class="justify-center"
  >
    <div class="align-center">
      <h1 class="text-uppercase text-center">Your List is Empty</h1>
      <div class="text-center">
        <v-dialog v-model="editDialog" max-width="290">
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              small
              color="primary"
              v-bind="attrs"
              v-on="on"
              class="mr-2"
              title="Edit Name"
            >
              <v-icon>mdi-pencil</v-icon>
            </v-btn>
          </template>
          <v-card>
            <v-card-title class="text-h5 text-break">
              Edit {{ listName }} List Title
            </v-card-title>
            <v-form
              ref="form"
              v-model="valid"
              class="px-6 pb-4"
              @submit.prevent
            >
              <v-text-field
                v-model="newListName"
                label="New List Title"
                required
                hide-details="auto"
                outlined
                @keyup.enter="renameList"
                :rules="rules"
              ></v-text-field>
              <p class="error--text text-caption" v-if="duplicate">
                You already have a list with that name.
              </p>
              <v-btn
                block
                color="success"
                @click="renameList"
                class="mt-2"
                :disabled="!valid"
              >
                Confirm
              </v-btn>
              <v-btn
                block
                color="primary"
                @click="editDialog = false"
                class="mt-2"
              >
                Cancel
              </v-btn>
            </v-form>
          </v-card>
        </v-dialog>
        <v-dialog v-model="deleteDialog" max-width="290">
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              small
              color="error"
              v-bind="attrs"
              v-on="on"
              title="Delete List"
            >
              <v-icon>mdi-delete</v-icon>
            </v-btn>
          </template>
          <v-card>
            <v-card-title class="text-h5 text-break">
              Delete {{ listName }}
            </v-card-title>
            <v-card-text
              >Performing this action will be permanent and you will not be able
              to restore your list. To permanently delete this list, select
              'DELETE'.</v-card-text
            >
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="primary" @click="deleteDialog = false">
                Cancel
              </v-btn>
              <v-btn color="error" @click="deleteList">
                Delete
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </div>
    </div>
  </v-container>
  <v-container v-else fill-height class="justify-center">
    <div class="d-flex align-center flex-column">
      <h1 class="mb-2 text-uppercase text-center">Loading details...</h1>
      <BaseLoadingRoller />
    </div>
  </v-container>
</template>

<script>
import { mapGetters } from 'vuex'
import dbClient from '../services/dbCalls'
import BaseLoadingRoller from '../components/BaseLoadingRoller'
import MediaCard from '../components/MediaCard'
import MediaMobileList from '../components/MediaMobileList'

export default {
  name: 'UserListTitles',
  components: {
    BaseLoadingRoller,
    MediaCard,
    MediaMobileList
  },
  data() {
    return {
      userListTitles: [],
      list: [],
      editDialog: false,
      deleteDialog: false,
      newListName: '',
      loading: true,
      valid: false,
      duplicate: false,
      rules: [
        value => !!value || 'Required.',
        value => /^[a-zA-Z\s]*$/.test(value) || 'Alphabetical characters only.'
      ]
    }
  },
  watch: {
    getLists: {
      deep: true,
      immediate: true,
      handler: 'getListTitles'
    }
  },
  computed: {
    ...mapGetters(['getUID', 'getLists']),
    listName() {
      let words = this.$route.params.name.split('-')
      const capitalizedWords = words.map(word => {
        return capitalizeFirstLetter(word)
      })

      return capitalizedWords.join(' ')

      function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1)
      }
    }
  },
  methods: {
    getUserList() {
      const lists = []
      for (let key in this.getLists) {
        if (this.getLists[key].name === this.listName) {
          this.list = this.getLists[key]
        }
      }

      //Figure out whats going on with this later
      delete this.list.isOnThisList
    },
    getListTitles() {
      this.getUserList()
      let list = []
      for (let key in this.getLists) {
        if (this.listName == this.getLists[key].name) {
          list = this.getLists[key].onList
        }
      }

      this.userListTitles = Object.keys(list).map(title => {
        return list[title]
      })

      this.loading = false
      this.setTitleTag()
    },
    deleteList() {
      let fieldName
      for (let key in this.getLists) {
        if (this.listName === this.getLists[key].name) {
          fieldName = key
        }
      }

      this.deleteDialog = false

      dbClient.deleteList(this.getUID, fieldName)
      this.$router.push({ name: 'Home' })
    },
    renameList() {
      let fieldName
      for (let key in this.getLists) {
        if (this.listName === this.getLists[key].name) {
          fieldName = key
        }

        if (
          this.getLists[key].name.toLowerCase() ===
          this.newListName.toLowerCase()
        ) {
          this.duplicate = true
        }
      }

      if (!this.duplicate && this.valid) {
        dbClient.renameList(this.getUID, this.list, fieldName, this.newListName)
        this.$router.push({ name: 'Home' })
      }
    },
    setTitleTag() {
      document.title = `${this.listName} | My Media Lists`
    }
  }
}
</script>

<style></style>
