<template>
  <v-row>
    <v-col
      cols="12"
      sm="6"
      md="4"
      v-for="(item, index) in iterations"
      :key="index"
    >
      <v-skeleton-loader type="article" class="mx-auto"></v-skeleton-loader>
    </v-col>
  </v-row>
</template>

<script>
export default {
  name: 'BaseLoadingListSkeleton',
  props: {
    amount: {
      type: Number,
      required: true
    }
  },
  computed: {
    iterations() {
      const iterations = []
      for (let i = 0; i < this.amount; i++) {
        iterations.push(i)
      }
      return iterations
    }
  }
}
</script>
