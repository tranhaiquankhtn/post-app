<template>
  <div>
    <v-container fluid>
      <v-card variant="outlined">
        <v-toolbar dark flat>
        <template v-slot:prepend>
          <v-card-title class="headline text-info">Manage User</v-card-title>
          </template>
          <template v-slot:append>
          <v-btn
            to="/main/admin/users/create"
            color="info"
            variant="flat"
            prepend-icon="mdi-account-plus"
            >Create User
          </v-btn>
          </template>
        </v-toolbar>
        <v-divider />
        <v-card-text>
          <v-table :headers="headers" :items="users" density="compact">
            <thead>
              <tr>
                <th class="text-left">Email</th>
                <th class="text-left">Full name</th>
                <th class="text-left">Active</th>
                <th class="text-left">Superuser</th>
                <th class="text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="user in users" :key="user.id">
                <td>{{ user.email }}</td>
                <td>{{ user.full_name }}</td>
                <td>
                  <v-icon v-if="user.is_active" color="green"
                    >mdi-check-circle</v-icon
                  >
                </td>
                <td>
                  <v-icon v-if="user.is_superuser" color="green"
                    >mdi-check-circle</v-icon
                  >
                </td>
                <td>
                  <v-tooltip text="Edit User">
                    <template v-slot:activator="{ props }">
                      <v-btn
                        v-bind="props"
                        color="info"
                        size="small"
                        icon="mdi-pencil"
                        class="ma-2"
                        variant="text"
                        :to="{
                          path: `/main/admin/users/edit/${user.id}`,
                        }"
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
import { readUsers } from '@/store/admin/getters'
import { dispatchGetUsers } from '@/store/admin/actions'

import { IUserProfile } from '@/types/profile'

const users: Ref<IUserProfile[]> = ref([])
const headers = [
  {
    title: 'Email',
    sortable: true,
    key: 'email',
    align: 'left',
  },
  {
    title: 'Full Name',
    sortable: true,
    key: 'full_name',
    align: 'left',
  },
  {
    title: 'Active',
    sortable: true,
    key: 'is_active',
    align: 'center',
  },
  {
    title: 'Super User',
    sortable: true,
    key: 'is_superuser',
    align: 'center',
  },
  {
    title: 'Actions',
    key: 'id',
  },
]
onBeforeMount(async () => {
  await dispatchGetUsers(store)
  users.value = [...readUsers(store)]
})
</script>
