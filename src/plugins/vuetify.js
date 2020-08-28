import Vue from 'vue'
import Vuetify from 'vuetify/lib'

Vue.use(Vuetify)

const vuetify = new Vuetify({
  theme: {
    themes: {
      // light: {
      //   primary: '#1C3144',
      //   secondary: '#3E8989',
      //   accent: '#D9DBF1'
      // }
      light: {
        primary: '#1D2D44',
        secondary: '#C33C54',
        accent: '#028090',
        info: '#CAE9FF',
        success: '#04724D',
        warning: '#FFE347',
        error: '#CB2C2C'
      }
    }
  }
})

export default vuetify
