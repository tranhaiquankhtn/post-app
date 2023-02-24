import { actions } from './actions'
import { getters } from './getters'
import { mutations } from './mutations'
import { AppState } from './state'
export const appState: AppState = {
  token: '',
  isLoggedIn: false,
  loggedInError: false,
  showDrawer: false,
  miniDrawer: false,
  userProfile: null,
  notifications: [],
}

export const mainModule = {
  state: appState,
  mutations,
  actions,
  getters,
}
