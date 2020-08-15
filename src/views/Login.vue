<template>
  <v-container fill-height>
    <AccountForm formType="Login" />
  </v-container>
</template>

<script>
import AccountForm from '../components/AccountForm'

export default {
  name: 'Login',
  components: { AccountForm },
  data() {
    return {}
  }
}
</script>
