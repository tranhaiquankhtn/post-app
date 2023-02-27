import { getStoreAccessors } from 'typesafe-vuex'
import { AdminState } from './state'
import { State } from '../state'

export const getters = {
  users: (state: AdminState) => state.users,
  userById: (state: AdminState) => (userId: number) => {
    const matchedUsers = state.users.filter((e) => e.id === userId)
    if (matchedUsers.length > 0) {
      return { ...matchedUsers[0] }
    }
  },
}

const { read } = getStoreAccessors<AdminState | any, State>('')

export const readUsers = read(getters.users)
export const readUserBy = read(getters.userById)
