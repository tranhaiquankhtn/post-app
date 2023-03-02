import axios from 'axios'
import { authHeader } from './commons'

import { apiUrl } from '@/env'

export const postApi = {
    getPosts(token: string) {
        return axios.get('${apiUrl}/api/v1/posts', authHeader(token))
    },
    getPostById(token: string, id: number) {
        return axios.get(`${apiUrl}/api/v1/posts/${id}`, authHeader(token))
    },
}
