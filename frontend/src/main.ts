import { createApp } from 'vue'

import App from './App.vue'
import router from '@/router'
import store from '@/store'
import vuetify from '@/plugins/vuetify'
import '@/styles/default.scss'
import '@mdi/font/css/materialdesignicons.css'

const app = createApp(App)
app.use(store)
app.use(router)
app.use(vuetify)
app.mount('#app')

app.config.globalProperties.$filters = {
  formatDate(d: any) {
    return new Date(d).toLocaleString()
  },
}
