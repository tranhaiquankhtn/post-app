import axios from 'axios'
import { authHeader } from './commons'

import { apiUrl } from '@/env'
import { IPostCreate, IPostUpdate } from '@/types/post'

export const postApi = {
  getPosts(token: string) {
    return axios.get(`${apiUrl}/api/v1/posts`, authHeader(token))
  },
  getPostById(token: string, id: number) {
    return axios.get(`${apiUrl}/api/v1/posts/${id}`, authHeader(token))
  },
  createPost(token: string, post: IPostCreate) {
    return axios.post(`${apiUrl}/api/v1/posts`, post, authHeader(token))
  },
  updatePost(token: string, id: number, post: IPostUpdate) {
    return axios.put(`${apiUrl}/api/v1/posts/${id}`, post, authHeader(token))
  },
  removePost(token: string, id: number) {
    return axios.delete(`${apiUrl}/api/v1/posts/${id}`, authHeader(token))
  },
}
