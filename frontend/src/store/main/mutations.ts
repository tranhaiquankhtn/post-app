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
}

const { commit } = getStoreAccessors<AppState | any, State>('')
export const commitSetToken = commit(mutations.setToken)
export const commitSetLogIn = commit(mutations.setLogIn)
export const commitSetLogInError = commit(mutations.setLogInError)
export const commitSetUserProfile = commit(mutations.setUserProfile)
export const commitAddNotification = commit(mutations.addNotification)
