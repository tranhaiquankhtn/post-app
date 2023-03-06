<template>
  <div>
    <v-container fluid>
      <v-card variant="outlined">
        <v-toolbar dark>
          <v-card-title> Create a new post</v-card-title>
        </v-toolbar>
        <v-divider></v-divider>
        <v-card-text>
          <v-form ref="form" v-model="valid" fast-fail @submit.prevent>
            <v-text-field
              v-model="currentPost.title"
              label="title"
              :rules="[
                (v) => !!v || 'Title is required',
                (v) =>
                  (v && v.length < 20) ||
                  'Title must be at less than 20 character',
              ]"
              required
            />
            <v-textarea
              v-model="currentPost.content"
              label="content"
              append-inner-icon="mdi-comment"
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
            type="submit"
            color="info"
            variant="flat"
            :disabled="!valid"
            @click="submit"
            >Submit</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-container>
  </div>
</template>
<script setup lang="ts">
import { ref, onBeforeMount, reactive } from 'vue'
import { store } from '@/store'
import router from '@/router'
import { readToken } from '@/store/main/getters'
import {
  commitAddNotification,
  commitRemoveNotification,
} from '@/store/main/mutations'
import { postApi } from '@/apis/post'
import { IPost } from '@/types/post'

const valid = ref(true)
const currentPost: IPost = reactive({ title: '', content: '' } as IPost)
const submit = async () => {
  const loadingNotification = {
    msg: 'Updating post',
    color: 'info',
    showProgress: true,
  }
  try {
    commitAddNotification(store, loadingNotification)
    const token = readToken(store)
    await postApi.updatePost(
      token,
      +router.currentRoute.value.params.id,
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
      +router.currentRoute.value.params.id,
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
