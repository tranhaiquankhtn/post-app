import { defineStore } from 'pinia'
import { AppState } from './main/state'

export const appState = defineStore('appState', {
  state: (): AppState => {
    return {
      token: '',
      isLoggedIn: false,
      loggedInError: false,
      showDrawer: false,
      miniDrawer: false,
      userProfile: null,
    }
  },
  getters: {
    readLoggedIn: (state: AppState) => state.isLoggedIn,
    readToken: (state: AppState) => state.token,
    readLoggedInError: (state: AppState) => state.loggedInError,
    readShowDrawer: (state: AppState) => state.showDrawer,
    readMiniDrawer: (state: AppState) => state.miniDrawer,
    readAdminAccess: (state: AppState) => {
      return state.userProfile && state.userProfile.isActive && state.userProfile.isSuperUser
    },
  },
})
