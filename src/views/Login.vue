<template>
  <v-container fill-height>
    <FormLogin />
  </v-container>
</template>

<script>
import FormLogin from '../components/FormLogin'

export default {
  name: 'Login',
  components: { FormLogin },
  data() {
    return {}
  }
}
</script>
