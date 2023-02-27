import 'typeface-roboto/index.css'

import { createVuetify } from 'vuetify'
import 'vuetify/styles';
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'



const vuetify = createVuetify({
  components,
  directives,
  theme: {
    defaultTheme: 'dark',
  },
})

export default vuetify
