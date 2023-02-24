import { ActionContext } from 'vuex'
import { State } from '../state'
import { AppNotification, AppState } from './state'
import {
  commitSetToken,
  commitSetLogIn,
  commitSetLogInError,
  commitAddNotification,
  commitSetUserProfile,
} from './mutations'
import { getStoreAccessors } from 'typesafe-vuex'

import { authApi } from '@/apis/auth'
import { userApi } from '@/apis/user'

import { getLocalToken, removeLocalToken, saveLocalToken } from '@/utils'
import router from '@/router'
import { AxiosError } from 'axios'

type AppContext = ActionContext<AppState, State>
export const actions = {
  async actionLogIn(context: AppContext, payload: { username: string; password: string }) {
    try {
      const res = await authApi.login(payload.username, payload.password)
      const token = res?.data?.access_token
      if (!token) {
        await dispatchLogOut(context)
        return
      }
      saveLocalToken(token)
      commitSetToken(token)
      commitSetLogIn(context, true)
      commitSetLogInError(context, false)

      await dispatchGetUserProfile(context, token)
      await dispatchRouteLogIn()
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
      const res = await userApi.getProfile(token)
      const profile = res?.data
      if (profile) {
        commitSetUserProfile(context, profile)
      }
    } catch (e) {
      await dispatchHandleApiError(context, e)
    }
  },
  async actionRouteLogIn() {
    if (router.currentRoute.value.path === '/login' || router.currentRoute.value.path === '') {
      router.push('/main')
    }
  },
  async actionRouteLogOut() {
    if (router.currentRoute.value.path !== '/login') {
      router.push('/')
    }
  },
  async actionHandleApiError(context: AppContext, error: AxiosError) {
    if (error.response!.status === 401) {
      await dispatchLogOut(context)
    }
  },
  async actionCheckLoggedIn(context: AppContext) {
    let token = ''
    if (!context.state.isLogged) {
      let token = context.state.token
      if (!token) {
        const tokenLocal = getLocalToken()
        if (tokenLocal) {
          commitSetToken(context, tokenLocal)
          token = tokenLocal
        }
      }
    }

    if (token) {
      await dispatchRemoveLogIn(context)
      return
    }
    try {
      const res = await userApi.getProfile(token)
      commitSetLogIn(context, true)
      commitSetUserProfile(context, res.data)
    } catch (e) {
      await dispatchRemoveLogIn(context)
    }
  },
}

const { dispatch } = getStoreAccessors<AppState | any, State>('')
export const dispatchLogIn = dispatch(actions.actionLogIn)
export const dispatchLogOut = dispatch(actions.actionLogOut)
export const dispatchRemoveLogIn = dispatch(actions.actionRemoveLogIn)
export const dispatchGetUserProfile = dispatch(actions.actionGetUserProfile)
export const dispatchRouteLogIn = dispatch(actions.actionRouteLogIn)
export const dispatchRouteLogOut = dispatch(actions.actionRouteLogOut)
export const dispatchHandleApiError = dispatch(actions.actionHandleApiError)
export const dispatchCheckLoggedIn = dispatch(actions.actionCheckLoggedIn)
