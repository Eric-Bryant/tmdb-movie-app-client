<template>
  <v-container>
    <div class="d-flex align-center">
      <h1 class="mr-2">Your Lists</h1>
      <v-dialog v-model="addDialog" max-width="290">
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            small
            color="primary"
            v-bind="attrs"
            v-on="on"
            class="mr-2"
            title="Edit Name"
          >
            <v-icon>mdi-plus</v-icon>
          </v-btn>
        </template>
        <v-card>
          <v-card-title class="text-h5 text-break">
            Create New List
          </v-card-title>
          <v-form ref="form" v-model="valid" class="px-6 pb-4" @submit.prevent>
            <v-text-field
              v-model="newListName"
              label="New List Title"
              required
              hide-details="auto"
              outlined
              :rules="rules"
              @keyup.enter="createList"
            ></v-text-field>
            <p class="error--text text-caption" v-if="duplicate">
              You already have a list with that name.
            </p>
            <v-btn
              block
              color="success"
              @click="createList"
              class="mt-2"
              :disabled="!valid"
            >
              Confirm
            </v-btn>
            <v-btn
              block
              color="primary"
              @click="addDialog = false"
              class="mt-2"
            >
              Cancel
            </v-btn>
          </v-form>
        </v-card>
      </v-dialog>
    </div>
    <v-row>
      <v-col
        cols="12"
        sm="6"
        md="4"
        v-for="(list, index) in userLists"
        :key="index"
      >
        <ListCard :list="list" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapGetters } from 'vuex'
import dbClient from '../services/dbCalls'
import ListCard from '../components/ListCard'

export default {
  name: 'UserLists',
  components: {
    ListCard
  },
  data() {
    return {
      userLists: [],
      loading: true,
      newListName: '',
      addDialog: false,
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
      handler: 'getUsersLists'
    }
  },
  computed: {
    ...mapGetters(['getUID', 'getLists'])
  },
  methods: {
    getUsersLists() {
      const lists = []
      for (let key in this.getLists) {
        lists.push(this.getLists[key])
      }

      this.userLists = lists
      this.loading = false
    },
    createList() {
      for (let key in this.getLists) {
        if (
          this.getLists[key].name.toLowerCase() ===
          this.newListName.toLowerCase()
        ) {
          this.duplicate = true
        }
      }

      if (!this.duplicate && this.valid) {
        dbClient.createNewList(this.getUID, this.newListName)
        this.addDialog = false
      }
    }
  }
}
</script>

<style></style>
