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
  hasAdminAccess: (state: AppState) => {
    console.log('userProfile: ', state.userProfile)
    return state.userProfile && state.userProfile.isActive && state.userProfile.isSuperUser
  }
}

const { read } = getStoreAccessors<AppState, State>('')

export const readToken = read(getters.token)
export const readUserProfile = read(getters.userProfile)
export const readLoggedInError = read(getters.loggedInError)
export const readIsLoggedIn = read(getters.isLoggedIn)
export const readShowDrawer = read(getters.showDrawer)
export const readMiniDrawer = read(getters.miniDrawer)
export const readHasAdminAccess = read(getters.hasAdminAccess)
