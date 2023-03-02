<template>
  <div>
    <v-container fluid>
      <v-card variant="outlined">
        <v-toolbar dark>
        <template v-slot:prepend>
          <v-card-title class="headline text-info">Posts</v-card-title>
          </template>
          <template v-slot:append>
          <v-btn
            to="/main/post/create"
            color="info"
            variant="flat"
            prepend-icon="mdi-account-plus"
            >Create User
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
              <tr v-for="post in posts" :key="post.id">
                <td>{{ post.title }}</td>
                <td>{{ post.content }}</td>
                <td>{{ post.created }}</td>
                <td>{{ post.modified }}</td>
                <td>
                  <v-tooltip text="Edit Post">
                    <template v-slot:activator="{ props }">
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
                  <v-tooltip text="Delete Post">
                    <template v-slot:activator="{ props }">
                      <v-btn
                        v-bind="props"
                        color="error"
                        size="small"
                        icon="mdi-trash"
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
import { ref, type Ref, reactive, onBeforeMount } from 'vue'

import { store } from '@/store'

import { IPost } from '@/types/post'

const posts: Ref<IPost[]> = ref([{ id: 1,title: 'tile', content:'content', created:'2023-01-01', modified: '2023-01-01' }])
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
const removePost= (postId: number) => {
    console.log('remove post with id=', postId)
}
onBeforeMount(async () => {
  /* await dispatchGetPosts(store) */
  /* posts.value = [...readPosts(store)] */
})
</script>
