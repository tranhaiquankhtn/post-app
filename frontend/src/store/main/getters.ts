import { AppState } from './state'
import { State } from '../state'

import { getStoreAccessors } from 'typesafe-vuex'
export const getters = {
  token: (state: AppState) => state.token,
  userProfile: (state: AppState) => state.userProfile,
  loggedInError: (state: AppState) => state.loggedInError,
  isLoggedIn: (state: AppState) => state.isLoggedIn,
  showDrawer: (state: AppState) => state.showDrawer,
  miniDrawer: (state: AppState) => state.miniDrawer,
  firstNotification: (state: AppState) =>
    state.notifications.length > 0 && state.notifications[0],
  hasAdminAccess: (state: AppState) => {
    return (
      state.userProfile &&
      state.userProfile.is_active &&
      state.userProfile.is_superuser
    )
  },
}

const { read } = getStoreAccessors<AppState, State>('')

export const readToken = read(getters.token)
export const readUserProfile = read(getters.userProfile)
export const readLoggedInError = read(getters.loggedInError)
export const readIsLoggedIn = read(getters.isLoggedIn)
export const readShowDrawer = read(getters.showDrawer)
export const readMiniDrawer = read(getters.miniDrawer)
export const readHasAdminAccess = read(getters.hasAdminAccess)
export const readFirstNotification = read(getters.firstNotification)
