import { actions } from './actions'
import { getters } from './getters'
import { mutations } from './mutations'
import { AdminState } from './state'
export const appState: AdminState = {
    users: []
}

export const adminModule = {
  state: appState,
  mutations,
  actions,
  getters,
}
