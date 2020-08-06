import Vue from 'vue'
import Vuetify from 'vuetify/lib'

Vue.use(Vuetify)

const vuetify = new Vuetify({
  theme: {
    themes: {
      light: {
        primary: '#1C3144',
        secondary: '#3E8989',
        accent: '#D9DBF1'
      }
    }
  }
})

export default vuetify
