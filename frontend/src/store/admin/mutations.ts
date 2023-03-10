import { State } from '../state'
import { AdminState } from './state'
import { IUserProfile } from '@/types/profile'

import { getStoreAccessors } from 'typesafe-vuex'

export const mutations = {
  setUser(state: AdminState, user: IUserProfile) {
    const users = state.users.filter((e) => e.id !== user.id)
    users.push(user)
    state.users = users
  },
  setUsers(state: AdminState, users: IUserProfile[]) {
    state.users = [...users]
  },
}

const { commit } = getStoreAccessors<AdminState, State>('')
export const commitSetUser = commit(mutations.setUser)
export const commitSetUsers = commit(mutations.setUsers)
