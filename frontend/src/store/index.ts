import { createStore } from 'vuex'
import { mainModule } from './main'
import { adminModule } from './admin'

export const store = createStore({
  modules: {
    main: mainModule,
    admin: adminModule,
  },
})

export default store
