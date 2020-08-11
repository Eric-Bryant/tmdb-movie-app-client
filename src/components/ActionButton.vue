<template>
  <v-btn>{{ onList ? 'Remove' : 'Add' }}</v-btn>
</template>

<script>
export default {
  name: 'ActionButton',
  props: {
    onList: {
      type: Boolean,
      default: false,
      required: true
    }
  }
}
</script>

<style></style>
