import { defineStore } from 'pinia'
import { AppState } from './main'
import { authApi } from '@/apis/auth'
import { userApi } from '@/apis/user'
import { saveLocalToken, removeLocalToken } from '@/utils'
import router from '@/router'

export const appState = defineStore('appState', {
  state: () =>
    ({
      token: '',
      isLoggedIn: false,
      loggedInError: false,
      showDrawer: false,
      miniDrawer: false,
      userProfile: null,
      notifications: [],
    } as AppState),
  getters: {
    readLoggedIn: (state: AppState) => state.isLoggedIn,
    readToken: (state: AppState) => state.token,
    readLoggedInError: (state: AppState) => state.loggedInError,
    readUserProfile: (state: AppState) => state.userProfile,
    readShowDrawer: (state: AppState) => state.showDrawer,
    readMiniDrawer: (state: AppState) => state.miniDrawer,
    hasAdminAccess: (state: AppState) => {
      return state.userProfile && state.userProfile.isActive && state.userProfile.isSuperUser
    },
  },

  actions: {
    async login(ctx: any, payload: { username: string; password: string }) {
      try {
        const res = await authApi.login(payload.username, payload.password)
        const token = res?.data?.access_token
        if (!token) {
          await this.logout(ctx)
          return
        }
        console.log('token=', token)
        saveLocalToken(token)
        ctx.$patch((state: AppState) => {
          state.token = token
          state.isLoggedIn = true
          state.loggedInError = false
          state.notifications.push({
            msg: `Welcome ${payload.username}`,
            color: 'success',
          })
        })
        await this.getUserProfile(ctx, token)
        await this.dispatchRouteLogin()
      } catch (e) {
        console.error(e)
        await this.logout(ctx)
        appState.loggedInError = true
        ctx.notifications.push({
          msg: 'Incorrect username or password',
          color: 'error',
        })
      }
    },
    async logout(ctx: AppState) {
      removeLocalToken()
      ctx.token = ''
      ctx.isLoggedIn = false
    },
    async getUserProfile(ctx: any, token: string) {
      const res = await userApi.getProfile(token)
      const profile = res?.data
      ctx.$patch({
        userProfile: { ...profile },
      })
    },
    async dispatchRouteLogin() {
      if (router.currentRoute.value.path === '/login' || router.currentRoute.value.path === '') {
        router.push('/main')
      }
    },
    async dispatchRouteLogout() {
      if (router.currentRoute.value.path !== '/login') {
        router.push('/')
      }
    },
  },
})
