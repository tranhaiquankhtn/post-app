import { ActionContext } from 'vuex'
import { State } from '../state'
import { AppNotification, AppState } from './state'
import {
  commitSetToken,
  commitSetLogIn,
  commitSetLogInError,
  commitAddNotification,
  commitSetUserProfile,
  commitRemoveNotification,
} from './mutations'
import { getStoreAccessors } from 'typesafe-vuex'

import { authApi } from '@/apis/auth'
import { userApi } from '@/apis/user'
import { postApi } from '@/apis/post'

import { IPost, IPostCreate, IPostUpdate } from '@/types/post'
import { IUserProfile, IUserProfileUpdate } from '@/types/profile'

import { getLocalToken, removeLocalToken, saveLocalToken } from '@/utils'
import router from '@/router'
import { AxiosError } from 'axios'

type AppContext = ActionContext<AppState, State>
export const actions = {
  async actionLogIn(
    context: AppContext,
    payload: { username: string; password: string },
  ) {
    try {
      const res = await authApi.login(payload.username, payload.password)
      const token = res.data.access_token
      if (!token) {
        await dispatchLogOut(context)
        return
      }
      saveLocalToken(token)
      commitSetToken(context, token)
      commitSetLogIn(context, true)
      commitSetLogInError(context, false)

      await dispatchGetUserProfile(context, token)
      await dispatchRouteLogIn(context)
      commitAddNotification(context, {
        msg: `Welcome ${payload.username}`,
        color: 'success',
      })
    } catch (e) {
      console.error(e)
      await dispatchLogOut(context)
      commitSetLogInError(context, true)
      commitAddNotification(context, {
        msg: 'Incorrect username or password',
        color: 'error',
      })
    }
  },
  async actionRemoveLogIn(context: AppState) {
    commitSetToken(context, '')
    removeLocalToken()
    commitSetLogIn(context, false)
  },
  async actionLogOut(context: AppState) {
    await dispatchRemoveLogIn(context)
    await dispatchRouteLogOut(context)
  },
  async actionGetUserProfile(context: AppState, token: string) {
    try {
      const res = await userApi.getSelf(token)
      const profile = res.data
      if (profile) {
        commitSetUserProfile(context, profile)
      }
    } catch (e) {
      await dispatchHandleApiError(context, e)
    }
  },
  async actionUpdateUserProfile(
    context: AppContext,
    profile: IUserProfileUpdate,
  ) {
    const loadingNotification: AppNotification = {
      msg: 'Updating',
      color: 'info',
      showProgress: true,
    }
    try {
      commitAddNotification(context, loadingNotification)
      const [res, _] = await Promise.all([
        userApi.updateSelf(context.state.token, profile),
        new Promise((resolved, _) => setTimeout(resolved, 500)),
      ])
      await commitSetUserProfile(context, res?.data)
      commitRemoveNotification(context, loadingNotification)
      commitAddNotification(context, {
        msg: 'Profile updated',
        color: 'success',
      })
    } catch (e) {
      await dispatchHandleApiError(context, e)
      commitRemoveNotification(context, loadingNotification)
      commitAddNotification(context, {
        msg: 'Update Failed',
        color: 'error',
      })
    }
  },
  async actionRouteLogIn(_: AppContext) {
    if (
      router.currentRoute.value.path === '/login' ||
      router.currentRoute.value.path === ''
    ) {
      router.push('/main')
    }
  },
  async actionRouteLogOut(_: AppContext) {
    if (router.currentRoute.value.path !== '/login') {
      router.push('/')
    }
  },
  async actionHandleApiError(context: AppContext, error: AxiosError) {
    if (error.response?.status === 401) {
      await dispatchLogOut(context)
    }
  },
  async actionCheckLoggedIn(context: AppContext) {
    let token = ''
    if (!context.state.isLoggedIn) {
      token = context.state.token
      if (!token) {
        const tokenLocal = getLocalToken()
        if (tokenLocal) {
          commitSetToken(context, tokenLocal)
          token = tokenLocal
        }
      }

      if (!token) {
        console.log('token not found. Remove logIn info')
        await dispatchRemoveLogIn(context)
        return
      }
      try {
        const res = await userApi.getSelf(token)
        commitSetLogIn(context, true)
        commitSetUserProfile(context, res.data)
      } catch (e) {
        await dispatchRemoveLogIn(context)
      }
    }
  },
  async actionRemoveNotification(
    context: AppContext,
    payload: { notification: AppNotification; timeout: number },
  ) {
    return new Promise((resolve, _) => {
      setTimeout(() => {
        commitRemoveNotification(context, payload.notification)
        resolve(true)
      }, payload.timeout)
    })
  },
}

const { dispatch } = getStoreAccessors<AppState | any, State>('')
export const dispatchLogIn = dispatch(actions.actionLogIn)
export const dispatchLogOut = dispatch(actions.actionLogOut)
export const dispatchRemoveLogIn = dispatch(actions.actionRemoveLogIn)
export const dispatchGetUserProfile = dispatch(actions.actionGetUserProfile)
export const dispatchUpdateUserProfile = dispatch(
  actions.actionUpdateUserProfile,
)
export const dispatchRouteLogIn = dispatch(actions.actionRouteLogIn)
export const dispatchRouteLogOut = dispatch(actions.actionRouteLogOut)
export const dispatchHandleApiError = dispatch(actions.actionHandleApiError)
export const dispatchCheckLoggedIn = dispatch(actions.actionCheckLoggedIn)
export const dispatchRemoveNotification = dispatch(
  actions.actionRemoveNotification,
)
