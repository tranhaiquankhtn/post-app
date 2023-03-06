<template>
  <v-container fluid>
    <v-card variant="outlined">
      <v-toolbar dark>
        <template #prepend>
          <v-card-title primary-title class="text-info">
            User Profile</v-card-title
          >
        </template>
      </v-toolbar>
      <v-divider></v-divider>
      <v-card-text>
        <div class="my-4">
          <div class="text-body-1 text-medium-emphasis text-grey-lighten-2">
            Full Name
          </div>
          <div
            v-if="userProfile && userProfile.full_name"
            class="text-subtitle-1 text-blue-darken-2"
          >
            {{ userProfile.full_name }}
          </div>
          <div v-else class="text-subtitle-1 text-blue-darken-2">----</div>
          <div class="my-3">
            <div class="text-body-1 text-medium-emphasis text-grey-lighten-2">
              Email
            </div>
            <div
              v-if="userProfile && userProfile.email"
              class="text-subtitle-1 text-blue-darken-2"
            >
              {{ userProfile.email }}
            </div>
            <div v-else class="text-subtitle-1 text-blue-darken-2">----</div>
          </div>
        </div>
      </v-card-text>
      <v-card-actions>
        <v-btn to="/main/profile/edit" color="info" variant="flat">Edit</v-btn>
        <v-btn to="/main/profile/password" color="error" variant="tonal"
          >Change Password</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import { ref, type Ref } from 'vue'
import { store } from '@/store'
import { IUserProfile } from '@/types/profile'
import { readUserProfile } from '@/store/main/getters'

const userProfile: Ref<IUserProfile> = ref(
  readUserProfile(store) as IUserProfile,
)
</script>
