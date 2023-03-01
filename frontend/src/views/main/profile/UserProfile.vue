<template>
  <v-container fluid>
    <v-card class="ma-3 pa-3" variant="outlined">
      <v-card-title primary-title class="text-info"> User Profile</v-card-title>
      <v-divider></v-divider>
      <v-card-text>
        <div class="my-4">
          <div class="text-body-1 text-medium-emphasis text-grey-lighten-2">
            Full Name
          </div>
          <div
            class="text-subtitle-1 text-blue-darken-2"
            v-if="userProfile && userProfile.full_name"
          >
            {{ userProfile.full_name }}
          </div>
          <div class="text-subtitle-1 text-blue-darken-2" v-else>----</div>
          <div class="my-3">
            <div class="text-body-1 text-medium-emphasis text-grey-lighten-2">
              Email
            </div>
            <div
              class="text-subtitle-1 text-blue-darken-2"
              v-if="userProfile && userProfile.email"
            >
              {{ userProfile.email }}
            </div>
            <div class="text-subtitle-1 text-blue-darken-2" v-else>----</div>
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
import { defineComponent, ref, type Ref } from 'vue'
import { store } from '@/store'
import { IUserProfile } from '@/types/profile'
import { readUserProfile } from '@/store/main/getters'

const userProfile: Ref<IUserProfile> = ref(readUserProfile(store))
</script>
