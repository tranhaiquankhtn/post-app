import axios from 'axios'
import { apiUrl } from '@/env'

export const authApi = {
  async login(username: string, password: string) {
    const params = new URLSearchParams()
    params.set('username', username)
    params.set('password', password)

    return axios.post(`${apiUrl}/api/v1/auth/login`, params)
  },
}
