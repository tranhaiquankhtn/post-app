<script lang="ts">
import { defineComponent, computed } from 'vue'
import { store } from '@/store'
import { readUserProfile } from '@/store/main/getters'

export default defineComponent({
  name: 'Dashboard',
  setup() {
    return {
      greetUser: computed(() => {
        const userProfile = readUserProfile(store)
        console.log('userProfile: ', userProfile)
        if (userProfile) {
          if (userProfile.fullName) {
            return userProfile.fullName
          }
          return userProfile.email
        }
        return ''
      }),
    }
  },
})
</script>

<template>
  <v-container>
    <v-layout fluid>
      <v-card class="mx-auto" variant="outlined">
        <v-card-title primary-title>
          <div class="headline primary--text">Dashboard</div>
        </v-card-title>
        <v-card-text>
          <div class="headline font-weight-light ma-5">
            Welcome {{ greetUser }}
          </div>
        </v-card-text>
        <v-card-actions>
          <v-btn to="/main/profile/view" color="primary" variant="flat"
            >View Profile</v-btn
          >
          <v-btn to="/main/profile/edit" color="info" variant="flat"
            >Edit Profile</v-btn
          >
          <v-btn to="/main/profile/password" color="error" variant="flat"
            >Change Profile</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-layout>
  </v-container>
</template>
