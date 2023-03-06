<template>
  <v-container fluid>
    <v-card variant="outlined">
      <v-toolbar dark>
        <v-card-title> Create a new post</v-card-title>
      </v-toolbar>
      <v-divider></v-divider>
      <v-card-text>
        <v-form ref="form" v-model="valid" fast-fail @submit.prevent>
          <v-text-field
            v-model="title"
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
            v-model="content"
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
</template>
<script setup lang="ts">
import { ref } from 'vue'
import { store } from '@/store'
import { readToken } from '@/store/main/getters'
import { postApi } from '@/apis/post'
import { AppNotification } from '@/store/main/state'
import { IPostCreate } from '@/types/post'
import router from '@/router'

import {
  commitRemoveNotification,
  commitAddNotification,
} from '@/store/main/mutations'

const valid = ref(true)
const title = ref('')
const content = ref('')

const submit = async () => {
  const post: IPostCreate = {
    title: title.value,
    content: content.value,
  }

  const loadingNotification: AppNotification = {
    msg: 'Creating post',
    color: 'info',
    showProgress: true,
  }

  try {
    commitAddNotification(store, loadingNotification)
    const token = readToken(store)
    await postApi.createPost(token, post)
    commitRemoveNotification(store, loadingNotification)
    commitAddNotification(store, { msg: 'Post Created', color: 'success' })
    router.push({ path: '/main/post/view' })
  } catch (e) {
    console.error(e)
    commitRemoveNotification(store, loadingNotification)
    commitAddNotification(store, {
      msg: 'Failed to create post. Please try again',
      color: 'error',
    })
  }
}
</script>
