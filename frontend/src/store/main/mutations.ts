import { getStoreAccessors } from 'typesafe-vuex'
import { State } from '../state'
import { AppNotification, AppState } from './state'

import { IUserProfile } from '@/types/profile'

export const mutations = {
  setToken(state: AppState, token: string) {
    state.token = token
  },
  setLogIn(state: AppState, isLoggedIn: boolean) {
    state.isLoggedIn = isLoggedIn
  },
  setLogInError(state: AppState, loggedInError: boolean) {
    state.loggedInError = loggedInError
  },
  setUserProfile(state: AppState, profile: IUserProfile) {
    state.userProfile = profile
  },
  addNotification(state: AppState, notification: AppNotification) {
    state.notifications.push(notification)
  },
  removeNotification(state: AppState, notification: AppNotification) {
    state.notifications = state.notifications.filter((e) => e !== notification)
  },
  setShowDrawer(state: AppState, showDrawer: boolean) {
    state.showDrawer = showDrawer
  },
  setMiniDrawer(state: AppState, miniDrawer: boolean) {
    state.miniDrawer = miniDrawer
  },
}

const { commit } = getStoreAccessors<AppState | any, State>('')
export const commitSetToken = commit(mutations.setToken)
export const commitSetLogIn = commit(mutations.setLogIn)
export const commitSetLogInError = commit(mutations.setLogInError)
export const commitSetUserProfile = commit(mutations.setUserProfile)
export const commitAddNotification = commit(mutations.addNotification)
export const commitRemoveNotification = commit(mutations.removeNotification)
export const commitsetShowDrawer = commit(mutations.setShowDrawer)
export const commitSetMiniDrawer = commit(mutations.setMiniDrawer)
