import axios from 'axios'
import { apiUrl } from '@/env'

import { authHeader } from './commons'

export const authApi = {
  async login(username: string, password: string) {
    const params = new URLSearchParams()
    params.set('username', username)
    params.set('password', password)

    return axios.post(`${apiUrl}/api/v1/auth/login`, params)
  },
  async recoverPassword(email: string) {
    return axios.post(`${apiUrl}/api/v1/auth/recover/${email}`)
  },
  async resetPassword(token: string, password: string) {
    return axios.post(
      `${apiUrl}/api/v1/auth/reset-password`,
      { token, password },
      authHeader(token),
    )
  },
}
