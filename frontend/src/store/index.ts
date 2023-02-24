import Vue from 'vue'
import Vuex, { StoreOptions } from 'vuex'
import { State } from './state'
import { mainModule } from './main'
import {adminModule} from './admin'

Vue.use(Vuex)

const options: StoreOptions<State> = {
    modules: {
        main: mainModule,
        admin: adminModule,
    }
}

export const store = new Vuex.Store<State>(options)
export default store
