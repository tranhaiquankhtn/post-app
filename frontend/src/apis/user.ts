import axios from 'axios'
import { authHeader } from './commons'
import { IUserProfile, IUserProfileCreate, IUserProfileUpdate } from '@/types/profile'
import { apiUrl } from '@/env'

export const userApi = {
    async getProfile(token: string) {
        return axios.get<IUserProfile>(`${apiUrl}/api/v1/users/self`, authHeader(token))
    },
    async getUsers(token: string) {
        return axios.get<IUserProfile[]>(`${apiUrl}/api/v1/users`, authHeader(token))
    },
    async createUser(token: string, user: IUserProfileCreate) {
        return axios.post(`${apiUrl}/api/v1/users`, user, authHeader(token))
    },
    async updateUser(token: string, id: number, user: IUserProfileUpdate) {
        return axios.put(`${apiUrl}/api/v1/users/${id}`, user, authHeader(token))
    }
}
