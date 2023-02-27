import { createApp } from 'vue'

import App from './App.vue'
import router from '@/router'
import store from '@/store'
import vuetify from '@/plugins/vuetify'
import '@/styles/default.scss'
import '@mdi/font/css/materialdesignicons.css'

createApp(App).use(store).use(router).use(vuetify).mount('#app')
