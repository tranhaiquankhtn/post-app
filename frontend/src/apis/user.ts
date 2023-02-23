import axios from 'axios'
import { authHeader } from './commons'
import { IUserProfile } from '@/types/profile'
import { apiUrl } from '@/env'

export const userApi = {
    async getProfile(token: string) {
        return axios.get<IUserProfile>(`${apiUrl}/api/v1/users/self`, authHeader(token))
    }
}
