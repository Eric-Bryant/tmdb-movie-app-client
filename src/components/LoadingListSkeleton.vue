<template>
  <v-row>
    <v-col cols="12" sm="6" md="4" v-for="item in [1, 2]" :key="item.index">
      <v-skeleton-loader
        boilerplqate="true"
        type="article"
        class="mx-auto"
      ></v-skeleton-loader>
    </v-col>
  </v-row>
</template>

<script>
export default {
  name: 'LoadingListSkeleton'
}
</script>
