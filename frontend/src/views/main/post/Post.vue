<template>
  <div>
    <Loading :is-loading="isLoading" />
    <ConfirmDialog ref="confirmDlg" />
    <v-container fluid>
      <v-card variant="outlined">
        <v-toolbar dark>
          <template #prepend>
            <v-card-title class="headline text-info">Posts</v-card-title>
          </template>
          <template #append>
            <v-btn
              to="/main/post/create"
              color="info"
              variant="flat"
              prepend-icon="mdi-file-plus"
              >Create Post
            </v-btn>
          </template>
        </v-toolbar>
        <v-divider />
        <v-card-text>
          <v-table :headers="headers" :items="posts" density="compact">
            <thead>
              <tr>
                <th class="text-left">Title</th>
                <th class="text-left">Content</th>
                <th class="text-left">Created</th>
                <th class="text-left">Modified</th>
                <th class="text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="posts.length < 1">
                <td colspan="5">
                  <v-alert
                    transition="fade-transition"
                    type="warning"
                    density="compact"
                  >
                    No posts found
                  </v-alert>
                </td>
              </tr>
              <tr v-for="post in posts" :key="post.id">
                <td>{{ post.title }}</td>
                <td>{{ post.content }}</td>
                <td>{{ $filters.formatDate(post.created) }}</td>
                <td>{{ $filters.formatDate(post.modified) }}</td>
                <td>
                  <v-tooltip text="Edit Post">
                    <template #activator="{ props }">
                      <v-btn
                        v-bind="props"
                        color="info"
                        size="small"
                        icon="mdi-pencil"
                        class="ma-2"
                        variant="text"
                        :to="{
                          path: `/main/post/edit/${post.id}`,
                        }"
                      />
                    </template>
                  </v-tooltip>
                  <v-tooltip text="Remove Post">
                    <template #activator="{ props }">
                      <v-btn
                        v-bind="props"
                        color="error"
                        size="small"
                        icon="mdi-trash-can-outline"
                        class="ma-2"
                        variant="text"
                        @click="removePost(post.id)"
                      />
                    </template>
                  </v-tooltip>
                </td>
              </tr>
            </tbody>
          </v-table>
        </v-card-text>
      </v-card>
    </v-container>
  </div>
</template>
<script setup lang="ts">
import { ref, type Ref, onMounted } from 'vue'
import Loading from '@/components/Loading.vue'
import ConfirmDialog from '@/components/ConfirmDialog.vue'

import { postApi } from '@/apis/post'
import { store } from '@/store'
import { readToken } from '@/store/main/getters'
import {
  commitAddNotification,
  commitRemoveNotification,
} from '@/store/main/mutations'
import { IPost } from '@/types/post'

const isLoading: Ref<boolean> = ref(false)
const posts: Ref<IPost[]> = ref([])
const confirmDlg = ref<InstanceType<typeof ConfirmDialog> | null>(null)
const headers = [
  {
    title: 'Title',
    sortable: true,
    key: 'title',
    align: 'left',
  },
  {
    title: 'content',
    sortable: true,
    key: 'content',
    align: 'left',
  },
  {
    title: 'Created',
    sortable: true,
    key: 'created',
    align: 'center',
  },
  {
    title: 'Modified',
    sortable: true,
    key: 'modified',
    align: 'center',
  },
  {
    title: 'Actions',
    key: 'id',
  },
]
const removePost = async (postId: number) => {
  if (
    await confirmDlg.value!.open(
      'confirm',
      'Do you want to delete this post?',
      {
        width: 300,
        color: 'info',
      },
    )
  ) {
    const loadingNotification = { msg: 'Post deleting', color: 'info' }
    try {
      commitAddNotification(store, loadingNotification)
      const token = readToken(store)
      await postApi.removePost(token, postId)
      posts.value = [...posts.value.filter((e) => e.id != postId)]
      commitRemoveNotification(store, loadingNotification)
      commitAddNotification(store, { msg: 'Post deleted', color: 'success' })
    } catch (e) {
      console.error('error: ', e)
      commitRemoveNotification(store, loadingNotification)
      commitAddNotification(store, {
        msg: 'Failed to delete post',
        color: 'error',
      })
    }
  }
}
onMounted(async () => {
  try {
    isLoading.value = true
    const token = readToken(store)
    const res = await postApi.getPosts(token)
    if (res) {
      posts.value = [...res.data]
    }
  } catch (e) {
    console.error(e)
    commitAddNotification(store, {
      msg: 'Failed to fetch posts',
      color: 'error',
    })
  } finally {
    isLoading.value = false
  }
})
</script>
