import { userApi } from '@/apis/user'
import { AdminState } from './state'
import { State } from '../state'
import { ActionContext } from 'vuex'
import { getStoreAccessors } from 'typesafe-vuex'

import { commitSetUsers, commitSetUser } from './mutations'
import { commitAddNotification, commitRemoveNotification } from '../main/mutations'

import { AppNotification } from '../main/state'
import { dispatchHandleApiError } from '../main/actions'

import { IUserProfileCreate, IUserProfileUpdate } from '@/types/profile'

type AdminContext = ActionContext<AdminState, State>

export const actions = {
  async actionGetUsers(context: AdminContext) {
    try {
      const res = await userApi.getUsers(context.rootState.main.token)
      if (res) {
        commitSetUsers(context, res.data)
      }
    } catch (e) {
      await dispatchHandleApiError(context, e)
    }
  },
  async actionCreateUser(context: AdminContext, profile: IUserProfileCreate) {
    try {
      const loadingNotification: AppNotification = {
        msg: 'Creating',
        showProgress: true,
      }
      commitAddNotification(context, loadingNotification)
      const res = (
        await Promise.all([
          userApi.createUser(context.rootState.main.token, profile),
          await new Promise((resolve, reject) => setTimeout(resolve, 500)),
        ])
      )[0]
      commitSetUser(context, res.data)
      commitRemoveNotification(context, loadingNotification)
      commitAddNotification(context, {
        msg: 'User created',
        color: 'success',
      })
    } catch (e) {
      await dispatchHandleApiError(context, e)
    }
  },
  async actionUpdateUser(
    context: AdminContext,
    payload: { id: number; profile: IUserProfileUpdate },
  ) {
    try {
      const loadingNotification: AppNotification = {
        msg: 'Updating',
        showProgress: true,
      }
      commitAddNotification(context, loadingNotification)
      const res = (
        await Promise.all([
          userApi.updateUser(context.rootState.main.token, payload.id, payload.profile),
          await new Promise((resolve, reject) => setTimeout(resolve, 500)),
        ])
      )[0]

      commitSetUser(context, res.data)
      commitRemoveNotification(context, loadingNotification)
      commitAddNotification(context, {
        msg: 'User updated',
        color: 'success',
      })
    } catch (e) {
      await dispatchHandleApiError(e)
    }
  },
}

const { dispatch } = getStoreAccessors<AdminContext | any, State>('')

export const dispatchGetUsers = dispatch(actions.actionGetUsers)
export const dispatchCreateUser = dispatch(actions.actionCreateUser)
export const dispatchUpdateUser = dispatch(actions.actionUpdateUser)
