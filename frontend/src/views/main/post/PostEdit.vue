<template>
  <div>
    <v-container fluid>
      <v-card variant="outlined">
        <v-toolbar dark>
          <v-card-title> Create a new post</v-card-title>
        </v-toolbar>
        <v-divider></v-divider>
        <v-card-text>
          <v-form ref="form" fast-fail v-model="valid" @submit.prevent>
            <v-text-field
              label="title"
              v-model="currentPost.title"
              :rules="[
                (v) => !!v || 'Title is required',
                (v) =>
                  (v && v.length < 20) ||
                  'Title must be at less than 20 character',
              ]"
              required
            />
            <v-textarea
              label="content"
              append-inner-icon="mdi-comment"
              v-model="currentPost.content"
              :rules="[
                (v) => !!v || 'Content is required',
                (v) =>
                  (v && v.length < 200) ||
                  'Content must be at less than 200 character',
              ]"
              required
            />
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn @click="$router.back()">Cancel</v-btn>
          <v-btn
            @click="submit"
            type="submit"
            color="info"
            variant="flat"
            :disabled="!valid"
            >Submit</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-container>
  </div>
</template>
<script setup lang="ts">
import { ref, onBeforeMount, computed, reactive } from 'vue'
import { store } from '@/store'
import router from '@/router'
import { readToken } from '@/store/main/getters'
import {
  commitAddNotification,
  commitRemoveNotification,
} from '@/store/main/mutations'
import { postApi } from '@/apis/post'
import { IPost, IPostUpdate } from '@/types/post'

const valid = ref(true)
const currentPost: IPost = reactive({ title: '', content: '' })
const submit = async () => {
  const updatePost: IPostUpdate = {
    title: currentPost.title,
    content: currentPost.content,
  }
  const loadingNotification = {
    msg: 'Updating post',
    color: 'info',
    showProgress: true
  }
  try {
    commitAddNotification(store, loadingNotification)
    const token = readToken(store)
    const res = await postApi.updatePost(
      token,
      router.currentRoute.value.params.id,
      currentPost,
    )
    commitRemoveNotification(store, loadingNotification)
    commitAddNotification(store, { msg: 'Post updated', color: 'success' })
    router.push('/main/post/view')
  } catch (e) {
    console.log(e)
    commitRemoveNotification(store, loadingNotification)
    commitAddNotification(store, {
      msg: 'Failed to update post. Please try again',
      color: 'error',
    })
  }
}
onBeforeMount(async () => {
  try {
    const token = readToken(store)
    const res = await postApi.getPostById(
      token,
      router.currentRoute.value.params.id,
    )
    if (res) {
      currentPost.id = res.data.id
      currentPost.title = res.data.title
      currentPost.content = res.data.content
    }
  } catch (e) {
    console.error(e)
  }
})
</script>
