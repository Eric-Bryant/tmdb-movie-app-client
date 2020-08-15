<template>
  <v-container fill-height>
    <AccountForm formType="Register" />
  </v-container>
</template>

<script>
import AccountForm from '../components/AccountForm'

export default {
  name: 'CreateAccount',
  components: { AccountForm },
  data() {
    return {}
  }
}
</script>

<style></style>
